/*
 * File: app/view/analyzer/permission/PermissionAnalysisListViewController.js
 *
 * This file was generated by Sencha Architect version 3.2.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 5.1.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 5.1.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('GFManager.view.analyzer.permission.PermissionAnalysisListViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.permissionanalysislist',

    viewPermissionAnalysis: function(record) {
        this.fireViewEvent('viewPermissionAnalysis', this.getView(), record);
    },

    onPermissionAllButtonClick: function(button, e, eOpts) {
        this.viewPermissionAnalysis(null);
    },

    onPermissionGridpanelItemDblClick: function(dataview, record, item, index, e, eOpts) {
        this.viewPermissionAnalysis(record);
    }

});