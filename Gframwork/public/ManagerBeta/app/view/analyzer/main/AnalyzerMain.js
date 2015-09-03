/*
 * File: app/view/analyzer/main/AnalyzerMain.js
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

Ext.define('GFManager.view.analyzer.main.AnalyzerMain', {
    extend: 'Ext.container.Container',
    alias: 'widget.analyzermainanalyzermain',

    requires: [
        'GFManager.view.analyzer.main.AnalyzerMainViewModel',
        'GFManager.view.analyzer.main.AnalyzerMainViewController',
        'GFManager.view.analyzer.user.UserAnalysisList',
        'GFManager.view.analyzer.activity.ActivityAnalysisList',
        'GFManager.view.analyzer.badge.BadgeAnalysisList',
        'GFManager.view.analyzer.point.PointAnalysisList',
        'GFManager.view.analyzer.level.LevelAnalysisList',
        'GFManager.view.analyzer.status.StatusAnalysisList',
        'GFManager.view.analyzer.permission.PermissionAnalysisList',
        'GFManager.view.analyzer.mission.MissionAnalysisList',
        'Ext.tab.Panel',
        'Ext.tab.Tab',
        'Ext.grid.Panel',
        'Ext.form.FieldContainer',
        'Ext.form.Panel'
    ],

    controller: 'analyzermainanalyzermain',
    viewModel: {
        type: 'analyzermainanalyzermain'
    },
    layout: 'border',

    items: [
        {
            xtype: 'panel',
            region: 'west',
            cls: 'top_menu_color',
            padding: '0 5 0 0',
            ui: 'left-menu-panel',
            width: 380,
            layout: 'border',
            collapsible: true,
            title: 'Analysis',
            items: [
                {
                    xtype: 'tabpanel',
                    region: 'west',
                    border: false,
                    cls: 'top_menu_color',
                    itemId: 'managerMenu',
                    padding: '1 5 0 0',
                    ui: 'navigation',
                    width: 380,
                    bodyBorder: false,
                    collapsible: false,
                    activeTab: 0,
                    tabPosition: 'left',
                    tabRotation: 0,
                    items: [
                        {
                            xtype: 'panel',
                            padding: '0 0 0 1',
                            layout: 'fit',
                            headerOverCls: '',
                            iconCls: '',
                            title: 'User',
                            tabConfig: {
                                xtype: 'tab',
                                focusCls: '',
                                iconCls: 'left_menu_user_btn_over',
                                textAlign: 'left',
                                listeners: {
                                    mouseover: 'onUserTabMouseOver',
                                    mouseout: 'onUserTabMouseOut',
                                    deactivate: 'onUserTabDeactivate'
                                }
                            },
                            items: [
                                {
                                    xtype: 'useranalysislist',
                                    listeners: {
                                        viewUserAnalysis: 'onGridpanelViewUserAnalysis',
                                        beforerender: 'onUseAnalysisGridpanelBeforeRender'
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            padding: '0 0 0 1',
                            layout: 'fit',
                            title: 'Activity',
                            tabConfig: {
                                xtype: 'tab',
                                iconCls: 'left_menu_activity_btn',
                                textAlign: 'left',
                                listeners: {
                                    mouseover: 'onActivityTabMouseOver',
                                    mouseout: 'onActivityTabMouseOut',
                                    deactivate: 'onActivityTabDeactivate'
                                }
                            },
                            items: [
                                {
                                    xtype: 'activityanalysislist',
                                    listeners: {
                                        viewActivityAnalysis: 'onGridpanelViewActivityAnalysis',
                                        beforerender: 'onActivityAnalysisGridpanelBeforeRender'
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            padding: '0 0 0 1',
                            layout: 'fit',
                            iconCls: '',
                            title: 'Badge',
                            tabConfig: {
                                xtype: 'tab',
                                iconCls: 'left_menu_badge_btn',
                                textAlign: 'left',
                                listeners: {
                                    mouseover: 'onBadgeTabMouseOver',
                                    mouseout: 'onBadgeTabMouseOut',
                                    deactivate: 'onBadgeTabDeactivate'
                                }
                            },
                            items: [
                                {
                                    xtype: 'badgeanalysislist',
                                    listeners: {
                                        viewBadgeAnalysis: 'onGridpanelViewBadgeAnalysis',
                                        beforerender: 'onBadgeAnalysisGridpanelBeforeRender'
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            padding: '0 0 0 1',
                            layout: 'fit',
                            iconCls: '',
                            title: 'Point',
                            tabConfig: {
                                xtype: 'tab',
                                iconCls: 'left_menu_point_btn',
                                textAlign: 'left',
                                listeners: {
                                    mouseover: 'onPointTabMouseOver',
                                    mouseout: 'onPointTabMouseOut',
                                    deactivate: 'onPointTabDeactivate'
                                }
                            },
                            items: [
                                {
                                    xtype: 'pointanalysislist',
                                    listeners: {
                                        viewPointAnalysis: 'onGridpanelViewPointAnalysis',
                                        beforerender: 'onPointAnalysisGridpanelBeforeRender'
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            padding: '0 0 0 1',
                            layout: 'fit',
                            iconCls: '',
                            title: 'Level',
                            tabConfig: {
                                xtype: 'tab',
                                iconCls: 'left_menu_level_btn',
                                textAlign: 'left',
                                listeners: {
                                    mouseover: 'onLevelTabMouseOver',
                                    mouseout: 'onLevelTabMouseOut',
                                    deactivate: 'onLevelTabDeactivate'
                                }
                            },
                            items: [
                                {
                                    xtype: 'levelanalysislist',
                                    listeners: {
                                        viewLevelAnalysis: 'onGridpanelViewLevelAnalysis',
                                        beforerender: 'onLevelAnalysisGridpanelBeforeRender'
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            padding: '0 0 0 1',
                            layout: 'fit',
                            iconCls: '',
                            title: 'Status',
                            tabConfig: {
                                xtype: 'tab',
                                iconCls: 'left_menu_status_btn',
                                textAlign: 'left',
                                listeners: {
                                    mouseover: 'onStatusTabMouseOver',
                                    mouseout: 'onStatusTabMouseOut',
                                    deactivate: 'onStatusTabDeactivate'
                                }
                            },
                            items: [
                                {
                                    xtype: 'statusanalysislist',
                                    listeners: {
                                        viewStatusAnalysis: 'onGridpanelViewStatusAnalysis',
                                        beforerender: 'onStatusAnalysisGridpanelBeforeRender'
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            padding: '0 0 0 1',
                            layout: 'fit',
                            iconCls: '',
                            title: 'Permission',
                            tabConfig: {
                                xtype: 'tab',
                                iconCls: 'left_menu_permission_btn',
                                textAlign: 'left',
                                listeners: {
                                    mouseover: 'onPermissionTabMouseOver',
                                    mouseout: 'onPermissionTabMouseOut',
                                    deactivate: 'onPermissionTabDeactivate'
                                }
                            },
                            items: [
                                {
                                    xtype: 'permissionanalysislist',
                                    listeners: {
                                        viewPermissionAnalysis: 'onGridpanelViewPermissionAnalysis',
                                        beforerender: 'onPermissionAnalysisGridpanelBeforeRender'
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            padding: '0 0 0 1',
                            layout: 'fit',
                            iconCls: '',
                            title: 'Mission',
                            tabConfig: {
                                xtype: 'tab',
                                iconCls: 'left_menu_mission_btn',
                                textAlign: 'left',
                                listeners: {
                                    mouseover: 'onMissionTabMouseOver',
                                    mouseout: 'onMissionTabMouseOut',
                                    deactivate: 'onMissionTabDeactivate'
                                }
                            },
                            items: [
                                {
                                    xtype: 'missionanalysislist',
                                    listeners: {
                                        viewMissionAnalysis: 'onGridpanelViewMissionAnalysis',
                                        beforerender: 'onMissionAnalysisGridpanelBeforeRender'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'tabpanel',
            region: 'center',
            reference: 'AnalysisEditPanel',
            cls: 'top_menu_color',
            padding: '0 5 0 0',
            activeTab: 0,
            layout: {
                type: 'card',
                deferredRender: false
            },
            items: [
                {
                    xtype: 'panel',
                    title: 'Analysis View'
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            region: 'east',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'button',
                    height: 35,
                    maxHeight: 35,
                    minHeight: 35,
                    text: '전체 닫기',
                    listeners: {
                        click: 'onAllCloseAnalyzerButtonClick'
                    }
                },
                {
                    xtype: 'form',
                    flex: 1
                }
            ]
        }
    ]

});