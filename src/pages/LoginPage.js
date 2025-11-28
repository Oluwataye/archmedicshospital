"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var AuthContext_1 = require("@/contexts/AuthContext");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var card_1 = require("@/components/ui/card");
var sonner_1 = require("sonner");
var LoginPage = function () {
    var _a = (0, react_1.useState)(''), email = _a[0], setEmail = _a[1];
    var _b = (0, react_1.useState)(''), password = _b[0], setPassword = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var login = (0, AuthContext_1.useAuth)().login;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var handleLogin = function (e) {
        e.preventDefault();
        setLoading(true);
        // Simulate network delay
        setTimeout(function () {
            var success = login(email, password);
            if (success) {
                // Redirect based on user role
                if (email === 'admin@archmedics.com') {
                    navigate('/dashboard');
                }
                else if (email === 'doctor@archmedics.com') {
                    navigate('/dashboard');
                }
                else if (email === 'nurse@archmedics.com') {
                    navigate('/nurse');
                }
                else if (email === 'pharmacist@archmedics.com') {
                    navigate('/pharmacy');
                }
                else if (email === 'labtech@archmedics.com') {
                    navigate('/lab');
                }
                else if (email === 'cashier@archmedics.com') {
                    navigate('/cashier');
                }
                else if (email === 'ehr@archmedics.com') {
                    navigate('/ehr');
                }
                sonner_1.toast.success('Login successful!');
            }
            else {
                sonner_1.toast.error('Invalid email or password. Please try again.');
            }
            setLoading(false);
        }, 1000);
    };
    return (<div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-medical-primary flex items-center justify-center text-white text-2xl font-bold">
            A
          </div>
          <h1 className="mt-4 text-3xl font-bold">ARCHMEDICS HMS</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <card_1.Card>
          <card_1.CardHeader className="space-y-1">
            <card_1.CardTitle className="text-2xl font-bold text-center">Login</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label_1.Label htmlFor="email">Email</label_1.Label>
                <input_1.Input id="email" type="email" placeholder="Enter your email" value={email} onChange={function (e) { return setEmail(e.target.value); }} required/>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="password">Password</label_1.Label>
                  <a href="#" onClick={function (e) {
            e.preventDefault();
            sonner_1.toast.info('Password reset functionality would go here.');
        }} className="text-sm text-blue-500 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <input_1.Input id="password" type="password" placeholder="Enter your password" value={password} onChange={function (e) { return setPassword(e.target.value); }} required/>
              </div>
              <button_1.Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button_1.Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 gap-3 text-sm text-center">
                <div className="text-gray-500">
                  <strong>EHR Manager:</strong> ehr@archmedics.com / ehr123
                </div>
                <div className="text-gray-500">
                  <strong>Doctor:</strong> doctor@archmedics.com / doctor123
                </div>
                <div className="text-gray-500">
                  <strong>Lab Tech:</strong> labtech@archmedics.com / labtech123
                </div>
                <div className="text-gray-500">
                  <strong>Cashier:</strong> cashier@archmedics.com / cashier123
                </div>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>
    </div>);
};
exports.default = LoginPage;
