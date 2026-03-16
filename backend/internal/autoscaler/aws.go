package autoscaler

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/ec2"
	"github.com/aws/aws-sdk-go-v2/service/ec2/types"
)

type LaunchConfig struct {
	Region        string
	AMI           string
	InstanceType  string
	SubnetID      string
	SecurityGroup string
	KeyName       string
}

type Client struct {
	ec2Client *ec2.Client
	cfg       LaunchConfig
}

func NewClient(cfg LaunchConfig) (*Client, error) {
	awsCfg, err := config.LoadDefaultConfig(
		context.TODO(),
		config.WithRegion(cfg.Region),
	)
	if err != nil {
		return nil, err
	}

	return &Client{
		ec2Client: ec2.NewFromConfig(awsCfg),
		cfg:       cfg,
	}, nil
}

func (c *Client) LaunchInstances(count int32) error {
	_, err := c.ec2Client.RunInstances(context.TODO(), &ec2.RunInstancesInput{
		ImageId:      &c.cfg.AMI,
		InstanceType: types.InstanceType(c.cfg.InstanceType),
		MinCount:     &count,
		MaxCount:     &count,
		KeyName:      &c.cfg.KeyName,
		SubnetId:     &c.cfg.SubnetID,
		SecurityGroupIds: []string{
			c.cfg.SecurityGroup,
		},
	})
	return err
}

func (c *Client) StopInstance(instanceID string) error {
	_, err := c.ec2Client.StopInstances(context.TODO(), &ec2.StopInstancesInput{
		InstanceIds: []string{instanceID},
	})
	return err
}

func (c *Client) StartInstances(instanceIDs []string) error {
	_, err := c.ec2Client.StartInstances(context.TODO(), &ec2.StartInstancesInput{
		InstanceIds: instanceIDs,
	})
	return err
}

func (c *Client) GetStoppedInstances() ([]string, error) {
	out, err := c.ec2Client.DescribeInstances(context.TODO(), &ec2.DescribeInstancesInput{
		Filters: []types.Filter{
			{
				Name:   stringPtr("instance-state-name"),
				Values: []string{"stopped"},
			},
		},
	})
	if err != nil {
		return nil, err
	}

	var ids []string
	for _, res := range out.Reservations {
		for _, inst := range res.Instances {
			ids = append(ids, *inst.InstanceId)
		}
	}

	return ids, nil
}

func stringPtr(s string) *string {
	return &s
}





func (c *Client) RebootInstance(instanceID string) error {
	_, err := c.ec2Client.RebootInstances(context.TODO(), &ec2.RebootInstancesInput{
		InstanceIds: []string{instanceID},
	})
	return err
}