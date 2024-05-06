import React, { useEffect } from "react";
import "devextreme/dist/css/dx.light.css";
import "devexpress-richedit/dist/dx.richedit.css";
import {
    create,
    createOptions,
    RichEdit,
    ViewType,
    RichEditUnit,
    RibbonTabType,
    FileTabItemId,
    DocumentFormat
} from "devexpress-richedit";
import DataSource from "devextreme/data/data_source";


const RichEditComponent = () => {
    var richEdit = RichEdit;

    useEffect(() => {

        const options = createOptions();
        options.bookmarks.visibility = true;
        options.bookmarks.color = "#ff0000";
        options.confirmOnLosingChanges.enabled = true;
        options.confirmOnLosingChanges.message =
            "Are you sure you want to perform the action? All unsaved document data will be lost.";

        options.fields.updateFieldsBeforePrint = true;
        options.fields.updateFieldsOnPaste = true;

        var selector = function (dataItem) {
            var items = {
                currentDate: dataItem.currentDate,
                firstName: dataItem.contact.firstName,
                lastName: dataItem.contact.lastName,
                fullName: dataItem.contact.fullName,
                emailID: dataItem.contact.emailID,
                address: dataItem.contact.address,
                milestones: dataItem.milestones
            }
            return items;
        };

        var newDataSource = new DataSource({ store: DataModel, select: selector });

        options.mailMerge.dataSource = newDataSource;
        options.mailMerge.activeRecord = 0;
        options.mailMerge.viewMergedData = true;

        var fileTab = options.ribbon.getTab(RibbonTabType.File);
        var ribbonItemnew = fileTab.getItem(FileTabItemId.CreateNewDocument);

        fileTab.removeItem(ribbonItemnew);

        var ribbonItemdownload = fileTab.getItem(FileTabItemId.Download);
        ribbonItemdownload.text = "Export";
        // events
        options.events.activeSubDocumentChanged = () => { };
        options.events.autoCorrect = () => { };
        options.events.calculateDocumentVariable = (s, e) => {
            // 1 Approach           
            // This approach 
            if (e.variableName === 'contentDoc') {
                var docvarProc = richEdit.createDocumentProcessor();
                var RTFstring = '{\\rtf1\{\\fonttbl\\f0\\fswiss Helvetica;}\\f0\ This is some { \\b bold } text.\\par}';
                docvarProc.document.insertText(docvarProc.document.length, RTFstring);
                e.value = docvarProc;
                e.Handled = true;
            }
        };
        options.events.calculateDocumentVariableAsync = (s, e) => {
            // 2 Approach
            for (const data of e.data) {
                if (data.variableName === 'contentDoc') {
                    const d = s.createDocumentProcessor();
                    // Original Text: "Milestone data"
                    const base64 = "TWlsZXN0b25lIGRhdGE=";
                    d.importDocument(base64, DocumentFormat.Rtf, (importSuccess) => {
                        console.log(importSuccess);
                    });
                }
            }
        }
    
        options.events.characterPropertiesChanged = () => { };
        options.events.contentInserted = () => { };
        options.events.contentRemoved = () => { };
        options.events.documentChanged = () => { };
        options.events.documentFormatted = () => { };
        options.events.documentLoaded = (s, e) => {
            s.document.fields.updateAllFields()
        };
        options.events.gotFocus = () => { };
        options.events.hyperlinkClick = () => { };
        options.events.keyDown = () => { };
        options.events.keyUp = () => { };
        options.events.paragraphPropertiesChanged = () => { };
        options.events.lostFocus = () => { };
        options.events.pointerDown = () => { };
        options.events.pointerUp = () => { };
        options.events.saving = () => { };
        options.events.saved = () => { };
        options.events.selectionChanged = () => { };

        options.unit = RichEditUnit.Inch;
        options.view.viewType = ViewType.PrintLayout;
        options.view.simpleViewSettings.paddings = {
            left: 15,
            top: 15,
            right: 15,
            bottom: 15,
        };

        options.readOnly = false;
        options.width = "100%";
        options.height = "90vh";

        richEdit = create(document.getElementById("richEdit"), options);

        var documentAsBase64 = base64Data;
        richEdit.openDocument(documentAsBase64, 'Contract', DocumentFormat.Rtf);

    }, []);

    return (
        <>
            <div id="richEdit"></div>
        </>
    );
}

export default RichEditComponent;

const base64Data = "e1xydGYxXGRlZmYwe1xmb250dGJse1xmMCBDYWxpYnJpO319e1xjb2xvcnRibCA7XHJlZDBcZ3JlZW4wXGJsdWUyNTUgO317XCpcZGVmY2hwIFxmczIyfXtcc3R5bGVzaGVldCB7XHFsXGZzMjIgTm9ybWFsO317XCpcY3MxXGZzMjIgRGVmYXVsdCBQYXJhZ3JhcGggRm9udDt9e1wqXGNzMlx1bFxmczIyXGNmMSBIeXBlcmxpbms7fXtcKlx0czNcdHNyb3dkXGZzMjJccWxcdHN2ZXJ0YWx0XGNsdHhscnRiIE5vcm1hbCBUYWJsZTt9fXtcKlxsaXN0b3ZlcnJpZGV0YWJsZX17XGluZm99XG5vdWljb21wYXRcc3BseXR3bmluZVxodG1hdXRzcFxleHBzaHJ0blxzcGx0cGdwYXJcZGVmdGFiNzIwXHNlY3RkXG1hcmdsc3huMTQ0MFxtYXJncnN4bjE0NDBcbWFyZ3RzeG4xNDQwXG1hcmdic3huMTQ0MFxoZWFkZXJ5NzIwXGZvb3Rlcnk3MjBccGd3c3huMTIyNDBccGdoc3huMTU4NDBcY29sczFcY29sc3g3MjBccGFyZFxwbGFpblxxbHtcZnMyMlxjZjAgSGVsbG8gXGxpbmUgSGVyZSBpcyB0aGUgY29udGVudCB3aXRoIHRoZSBkb2MgdmFyaWFibGVcbGluZSBcbGluZSB9e1xmaWVsZFxkeGZsZGNvZGV2aWV3e1wqXGZsZGluc3R7XGZzMjJcY2YwIERPQ1ZBUklBQkxFICJjb250ZW50RG9jIn19e1xmbGRyc2x0fX1cZnMyMlxjZjBccGFyfQ==";

const DataModel = [{
    currentDate: new Date(),
    contact: {
        firstName: "Haider",
        lastName: "Ali",
        fullName: "Haider Ali",
        address: "90-B, Street Ola Road",
        emailID: "haider@alittech.com"
    },
    milestones: [
        {
            milestoneTitle: "New milestone 1",
            amount: 5000.00
        },
        {
            milestoneTitle: "New milestone 2",
            amount: 6500.00
        }

    ]
}]