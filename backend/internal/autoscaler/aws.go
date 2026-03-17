package autoscaler

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/ec2"
	"github.com/aws/aws-sdk-go-v2/service/ec2/types"
	"time"
	"fmt"
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




var instanceSpecs = map[string]struct {
	CPU    string
	Memory string
}{
	"t3.micro":  {"2 vCPU", "1 GB"},
	"t3.small":  {"2 vCPU", "2 GB"},
	"t3.medium": {"2 vCPU", "4 GB"},
	"t3.large":  {"2 vCPU", "8 GB"},
	"t3.xlarge": {"4 vCPU", "16 GB"},
}

type InstanceDetails struct {
	InstanceID  string `json:"instance_id"`
	InstanceType string `json:"instance_type"`
	CPU         string `json:"cpu"`
	Memory      string `json:"memory"`
	OS          string `json:"os"`
	State       string `json:"state"`
	LaunchTime  string `json:"launch_time"`
}


func (c *Client) GetInstanceDetails(instanceID string) (*InstanceDetails, error) {

	out, err := c.ec2Client.DescribeInstances(context.TODO(), &ec2.DescribeInstancesInput{
		InstanceIds: []string{instanceID},
	})
	if err != nil {
		return nil, err
	}

	if len(out.Reservations) == 0 || len(out.Reservations[0].Instances) == 0 {
		return nil, fmt.Errorf("instance not found")
	}

	inst := out.Reservations[0].Instances[0]

	instanceType := string(inst.InstanceType)

	spec, ok := instanceSpecs[instanceType]
	if !ok {
		spec = struct {
			CPU    string
			Memory string
		}{
			CPU:    "unknown",
			Memory: "unknown",
		}
	}

	os := "Linux/UNIX"
	if inst.PlatformDetails != nil {
		os = *inst.PlatformDetails
	}

	state := "unknown"
	if inst.State != nil && inst.State.Name != "" {
		state = string(inst.State.Name)
	}

	launchTime := ""
	if inst.LaunchTime != nil {
		launchTime = inst.LaunchTime.Format(time.RFC3339)
	}

	return &InstanceDetails{
		InstanceID:  instanceID,
		InstanceType: instanceType,
		CPU:         spec.CPU,
		Memory:      spec.Memory,
		OS:          os,
		State:       state,
		LaunchTime:  launchTime,
	}, nil
}