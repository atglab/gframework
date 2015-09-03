/*
 * File: app/view/analyzer/mission/MissionAnalysisList.js
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

Ext.define('GFManager.view.analyzer.mission.MissionAnalysisList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.missionanalysislist',

    requires: [
        'GFManager.view.analyzer.mission.MissionAnalysisListViewModel',
        'GFManager.view.analyzer.mission.MissionAnalysisListViewController',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.grid.column.RowNumberer'
    ],

    controller: 'missionanalysislist',
    viewModel: {
        type: 'missionanalysislist'
    },
    width: 250,
    collapsible: false,
    titleAlign: 'center',
    enableColumnHide: false,
    enableColumnMove: false,
    enableColumnResize: false,
    hideHeaders: true,
    store: 'Mission',

    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            items: [
                {
                    xtype: 'button',
                    flex: 1,
                    iconCls: '',
                    text: '전체 통계 보기',
                    listeners: {
                        click: 'onMissionAllButtonClick'
                    }
                }
            ]
        }
    ],
    columns: [
        {
            xtype: 'rownumberer',
            align: 'center',
            tdCls: 'x-grid-cell-row-numberer x-grid-cell-special grid-size',
            flex: 1
        },
        {
            xtype: 'gridcolumn',
            sortable: true,
            dataIndex: 'name',
            tdCls: 'grid-size',
            flex: 4
        }
    ],
    listeners: {
        itemclick: 'onMissionGridpanelItemDblClick'
    }

});