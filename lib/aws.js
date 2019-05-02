const env = require('./env');
const AWS = require('aws-sdk');
const awsGet = async (fn, params, key) => {
    return fn(params).promise().then(d => {
      if (d.nextToken) {
        return awsGet(fn, Object.assign(params, {nextToken: d.nextToken}), key)
          .then(data => data.concat(...d[key]));
      } else {
        return [].concat(...d[key]);
      }
    });
  };
const accountNames = Object.keys(env.get('aws')||{});
const accounts = accountNames.map(name => {
    return {
      name: name,
      accessKeyId: env.get(`aws:${name}:access_key`),
      secretAccessKey: env.get(`aws:${name}:secret_key`)
    };
  });
const getAccounts = type => accounts.reduce((o,d) => o.push({
    name: d.name,
    aws: new AWS[type]({
      region: 'us-east-1',
      accessKeyId: d.accessKeyId,
      secretAccessKey: d.secretAccessKey,
      apiVersion: '2016-11-15'
    })
  }) && o, []);

const getTasks = async () => {
  const info = {};
  const ecsAccounts = getAccounts('ECS');
  await Promise.all(ecsAccounts.map(async account => {
    const accountName = account.name;
    const ecs = account.aws;
    const clusters = await awsGet(ecs.listClusters.bind(ecs), {}, 'clusterArns');
    await Promise.all(clusters.map(async clusterArn => {
      const cluster = clusterArn.replace(/^.*cluster\//,'').replace(/-ECSClusterStack.*/,'').replace(/-Cluster/,'').replace(/-(?!.*-).*/,'');
      const tasks = await awsGet(ecs.listTasks.bind(ecs), { cluster: clusterArn, desiredStatus: 'RUNNING' }, 'taskArns')
        .then(taskArns => awsGet(ecs.describeTasks.bind(ecs), { tasks: taskArns, cluster: clusterArn }, 'tasks'))
        .then(tasks => tasks.map(task => {
          let name = task.taskDefinitionArn.replace(/:(?!.*:).*/,'');
          if (name.includes('dev')) {
            name = name.replace(/^.*dev-/, '').replace(/-Task/,' (') + ')';
          } else if (name.includes('release')) {
            name = name.replace(/.*release/,'').replace(/-Task/,'');
          } else {
            name = name.replace(/.*task-definition\//,'').replace(/-Task/,'');
          }
          return task.containers.map(container => {
            return {
              name: name,
              ip: (container.networkInterfaces[0]||{}).privateIpv4Address
            };
          });
        })).then(d => [].concat(...d));
      info[accountName] = info[accountName] || {};
      info[accountName][cluster] = tasks;
   }));
  }));
  return info;
};

const getInstances = async () => {
  const info = {};
  const ec2Accounts = getAccounts('EC2');
  await Promise.all(ec2Accounts.map(async account => {
    const accountName = account.name;
    const ec2 = account.aws;
    const instances = await awsGet(ec2.describeInstances.bind(ec2), { }, 'Reservations')
      .then(d => [].concat(...d.map(d => d.Instances)))
      .then(instances => instances.map(instance => {
        return {
          name: (instance.Tags.filter(d => d.Key === 'Name')[0]||{}).Value,
          keyname: instance.KeyName,
          publicIp: instance.PublicIpAddress,
          privateIp: instance.PrivateIpAddress,
          type: instance.InstanceType,
          state: instance.State.Name,
        }
      }));
    info[accountName] = instances;
  }));
  return info;
};

const getNatGateways = async () => {
  const info = {};
  const ec2Accounts = getAccounts('EC2');
  await Promise.all(ec2Accounts.map(async account => {
    const accountName = account.name;
    const ec2 = account.aws;
    const natGateways = await awsGet(ec2.describeNatGateways.bind(ec2), { }, 'NatGateways')
      .then(nats => nats.map(nat => {
        return {
          name: (nat.Tags.filter(d => d.Key === 'aws:cloudformation:stack-name')[0]||{}).Value,
          publicIp: nat.NatGatewayAddresses[0].PublicIp
        };
      }));
    info[accountName] = natGateways;
  }));
  return info;
};

const getVpcEndpoints = async () => {
  const info = {};
  const ec2Accounts = getAccounts('EC2');
  await Promise.all(ec2Accounts.map(async account => {
    const accountName = account.name;
    const ec2 = account.aws;
    const vpcEndpoints = await awsGet(ec2.describeVpcEndpoints.bind(ec2), { }, 'VpcEndpoints')
      .then(endpoints => endpoints.map(endpoint => {
        return {
          name: endpoint.ServiceName
        };
      }));
    info[accountName] = vpcEndpoints;
  }));
  return info;
};

const getVpcPeeringConnections = async () => {
  const info = {};
  const ec2Accounts = getAccounts('EC2');
  await Promise.all(ec2Accounts.map(async account => {
    const accountName = account.name;
    const ec2 = account.aws;
    const vpcPeeringConnections = await awsGet(ec2.describeVpcPeeringConnections.bind(ec2), { }, 'VpcPeeringConnections')
      .then(connections => connections.map(connection => {
        return {
          cidr: connection.AccepterVpcInfo.CidrBlock,
          remoteCidr: connection.RequesterVpcInfo.CidrBlock,
          remoteAccount: connection.RequesterVpcInfo.OwnerId,
          id: connection.VpcPeeringConnectionId
        };
      }));
    info[accountName] = vpcPeeringConnections;
  }));
  return info;
};

const getVolumes = async () => {
  const info = {};
  const ec2Accounts = getAccounts('EC2');
  await Promise.all(ec2Accounts.map(async account => {
    const accountName = account.name;
    const ec2 = account.aws;
    const volumes = await awsGet(ec2.describeVolumes.bind(ec2), { }, 'Volumes')
      .then(volumes => volumes.map(volume => {
        return {
          state: volume.State,
          id: volume.VolumeId,
          size: volume.Size
        }
      }));
   info[accountName] = volumes;
  }));
  return info;
};

const toString = async () => {
  let text = '';

  const tasks = await getTasks();
  const instances = await getInstances();

  Object.keys(tasks).sort().forEach(account => {
    Object.keys(tasks[account]).sort().forEach(cluster => {
      const bastionHost = instances[account].filter(d => String(d.name).includes('Bastion Host'))[0];
      text += `<br><br><u>${cluster} - ${tasks[account][cluster].length} instances - ${bastionHost.publicIp}</u>`;
      text += '<table>';
      tasks[account][cluster].sort((a,b) => a.name > b.name ? 1 : -1).forEach(task => {
        text += `<tr><td style="width:700px">${task.name}</td><td>${task.ip}</tr>`
      });
      text += '</table>';
    });
  });
  return text;
}

module.exports = {
  getTasks,
  getInstances,
  getNatGateways,
  getVpcEndpoints,
  getVpcPeeringConnections,
  getVolumes,
  toString
};
