package loadbalancer

import (
	"net/http"
	"net/http/httputil"
	"net/url"

	"load-balancer/internal/state"
)

func ProxyRequest(w http.ResponseWriter, r *http.Request, vm *state.VMState) error {
	target, err := url.Parse("http://" + vm.VMIP)
	if err != nil {
		return err
	}

	proxy := httputil.NewSingleHostReverseProxy(target)
	proxy.ServeHTTP(w, r)
	return nil
}

