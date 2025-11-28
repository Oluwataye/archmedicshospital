"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var table_1 = require("@/components/ui/table");
var DiseasePrevalenceTable = function (_a) {
    var filteredData = _a.filteredData, totalCount = _a.totalCount, onViewDetails = _a.onViewDetails;
    return (<table_1.Table>
            <table_1.TableHeader>
                <table_1.TableRow>
                    <table_1.TableHead>Disease</table_1.TableHead>
                    <table_1.TableHead>Cases</table_1.TableHead>
                </table_1.TableRow>
            </table_1.TableHeader>
            <table_1.TableBody>
                <table_1.TableRow>
                    <table_1.TableCell colSpan={2} className="text-center">No data available</table_1.TableCell>
                </table_1.TableRow>
            </table_1.TableBody>
        </table_1.Table>);
};
exports.default = DiseasePrevalenceTable;
