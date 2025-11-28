"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var AuthContext_1 = require("@/contexts/AuthContext");
var Index = function () {
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _a = (0, AuthContext_1.useAuth)(), isAuthenticated = _a.isAuthenticated, isLoading = _a.isLoading;
    (0, react_1.useEffect)(function () {
        if (!isLoading) {
            if (isAuthenticated) {
                navigate('/ehr'); // Direct to EHR dashboard instead of /dashboard
            }
            else {
                navigate('/login');
            }
        }
    }, [isAuthenticated, isLoading, navigate]);
    return (<div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-medical-primary flex items-center justify-center text-white text-2xl font-bold">
          A
        </div>
        <h1 className="mt-4 text-3xl font-bold">ARCHMEDICS HMS</h1>
        <p className="mt-2 text-xl text-gray-600">Loading...</p>
      </div>
    </div>);
};
exports.default = Index;
