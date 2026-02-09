package identity

import (
	"errors"
	"io"
	"net/http"
	"strings"
	"time"
)

const (
	tokenURL    = "http://169.254.169.254/latest/api/token"
	instanceURL = "http://169.254.169.254/latest/meta-data/instance-id"
)

func GetInstanceID() (string, error) {
	client := &http.Client{Timeout: 2 * time.Second}

	req, err := http.NewRequest("PUT", tokenURL, nil)
	if err != nil {
		return "", err
	}
	req.Header.Set("X-aws-ec2-metadata-token-ttl-seconds", "21600")

	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	tokenBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	token := string(tokenBytes)
	if token == "" {
		return "", errors.New("empty metadata token")
	}

	req, err = http.NewRequest("GET", instanceURL, nil)
	if err != nil {
		return "", err
	}
	req.Header.Set("X-aws-ec2-metadata-token", token)

	resp, err = client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	idBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	instanceID := strings.TrimSpace(string(idBytes))
	if instanceID == "" {
		return "", errors.New("empty instance id")
	}

	return instanceID, nil
}

