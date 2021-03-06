/*
 * File: app/view/manager/main/ManagerMain.js
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

Ext.define('GFManager.view.manager.main.ManagerMain', {
    extend: 'Ext.container.Container',
    alias: 'widget.managermain',

    requires: [
        'GFManager.view.manager.main.ManagerMainViewModel',
        'GFManager.view.manager.main.ManagerMainViewController',
        'GFManager.view.manager.user.UserList',
        'GFManager.view.manager.activity.ActivityList',
        'GFManager.view.manager.badge.BadgeList',
        'GFManager.view.manager.point.PointList',
        'GFManager.view.manager.level.LevelList',
        'GFManager.view.manager.status.StatusList',
        'GFManager.view.manager.permission.PermissionList',
        'GFManager.view.manager.mission.MissionList',
        'Ext.toolbar.Toolbar',
        'Ext.tab.Panel',
        'Ext.tab.Tab',
        'Ext.grid.Panel',
        'Ext.form.FieldContainer',
        'Ext.form.Panel'
    ],

    controller: 'managermain',
    viewModel: {
        type: 'managermain'
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
            title: 'Mechanics',
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {
                            xtype: 'button',
                            flex: 1,
                            text: '재시작',
                            listeners: {
                                click: 'onResetButtonClick'
                            }
                        },
                        {
                            xtype: 'button',
                            baseCls: 'edit_tooltip_btn',
                            overCls: 'edit_tooltip_btn_over',
                            iconAlign: 'right',
                            tooltip: '기존 게임 메카닉을 수정하거나 새로운 게임 메카닉을 추가한 경우, 재시작 버튼을 클릭해주세요.'
                        }
                    ]
                }
            ],
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
                                    xtype: 'userlist',
                                    reference: 'userlist',
                                    listeners: {
                                        viewUser: 'onGridpanelViewUser',
                                        beforerender: 'onUserGridpanelBeforeRender'
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
                                    xtype: 'activitylist',
                                    reference: 'activitylist',
                                    listeners: {
                                        viewActivity: 'onGridpanelViewActivity',
                                        beforerender: 'onActivityGridpanelBeforeRender'
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
                                    xtype: 'badgelist',
                                    reference: 'badgelist',
                                    listeners: {
                                        viewBadge: 'onGridpanelViewBadge',
                                        beforerender: 'onBadgeGridpanelBeforeRender'
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
                                    xtype: 'pointlist',
                                    reference: 'pointlist',
                                    listeners: {
                                        viewPoint: 'onGridpanelViewPoint',
                                        beforerender: 'onPointGridpanelBeforeRender'
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
                                    xtype: 'levellist',
                                    reference: 'levellist',
                                    listeners: {
                                        viewLevel: 'onGridpanelViewLevel',
                                        beforerender: 'onLevelGridpanelBeforeRender'
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
                                    xtype: 'statuslist',
                                    reference: 'statuslist',
                                    listeners: {
                                        viewStatus: 'onGridpanelViewStatus',
                                        beforerender: 'onStatusGridpanelBeforeRender'
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
                                    xtype: 'permissionlist',
                                    reference: 'permissionlist',
                                    listeners: {
                                        viewPermission: 'onGridpanelViewPermission',
                                        beforerender: 'onPermissionGridpanelBeforeRender'
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
                                    xtype: 'missionlist',
                                    reference: 'missionlist',
                                    listeners: {
                                        viewMission: 'onGridpanelViewMission',
                                        beforerender: 'onMissionGridpanelBeforeRender'
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
            reference: 'maintabeditpanel',
            cls: 'top_menu_color',
            activeTab: 0,
            items: [
                {
                    xtype: 'panel',
                    overlapHeader: false,
                    title: 'Mechanics Edit',
                    tabConfig: {
                        xtype: 'tab',
                        fixed: true,
                        closable: false
                    }
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
                        click: 'onAllCloseManagerButtonClick'
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