/*
 * File: app/view/manager/mission/MissionListViewController.js
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

Ext.define('GFManager.view.manager.mission.MissionListViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.missionlist',

    viewMission: function(record) {
        this.fireViewEvent('viewMission', this.getView(), record);
    },

    onMissionAddButtonClick: function(button, e, eOpts) {
        this.viewMission(null);
    },

    onMissionDelButtonClick: function(button, e, eOpts) {
        if(Ext.getStore('ManagerInfo').data.length !== 0) {
            var MissionGrid = button.up('missionlist');
            var selection = MissionGrid.getSelectionModel().getSelection()[0];

            selection.erase();

            this.viewMission(selection);

            button.disable();
        } else {
            Ext.MessageBox.alert('로그인 요청', '로그인 후 이용이 가능합니다.', function(btn){
                if (btn == 'ok') {
                }
            }, this);

        }

    },

    onMissionListviewSelectionChange: function(model, selected, eOpts) {
        var delBtn = this.lookupReference('del_mission_btn');
        delBtn.enable();
    },

    onMissionGridpanelItemDblClick: function(dataview, record, item, index, e, eOpts) {
        this.viewMission(record);
    }

});
