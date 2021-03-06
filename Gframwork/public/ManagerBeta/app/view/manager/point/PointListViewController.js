/*
 * File: app/view/manager/point/PointListViewController.js
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

Ext.define('GFManager.view.manager.point.PointListViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pointlist',

    viewPoint: function(record) {
        this.fireViewEvent('viewPoint', this.getView(), record);
    },

    onPointAddButtonClick: function(button, e, eOpts) {
        this.viewPoint(null);
    },

    onPointDelButtonClick: function(button, e, eOpts) {
        if(Ext.getStore('ManagerInfo').data.length !== 0) {
            var pointGrid = button.up('pointlist');
            var pointSelection = pointGrid.getSelectionModel().getSelection()[0];

            pointSelection.erase();

            this.viewPoint(pointSelection);

            button.disable();
        } else {
            Ext.MessageBox.alert('로그인 요청', '로그인 후 이용이 가능합니다.', function(btn){
                if (btn == 'ok') {
                }
            }, this);

        }
    },

    onPointlistviewSelectionChange: function(model, selected, eOpts) {
        var delPointBtn = this.lookupReference('del_point_btn');
        delPointBtn.enable();
    },

    onGridpanelPointItemDblClick: function(dataview, record, item, index, e, eOpts) {
        this.viewPoint(record);
    }

});
