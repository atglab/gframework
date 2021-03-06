/*
 * File: app/view/manager/permission/PermissionEdit.js
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

Ext.define('GFManager.view.manager.permission.PermissionEdit', {
    extend: 'Ext.form.Panel',
    alias: 'widget.permissionedit',

    requires: [
        'GFManager.view.manager.permission.PermissionEditViewModel',
        'GFManager.view.manager.permission.PermissionEditViewController',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.form.FieldSet',
        'Ext.form.field.TextArea',
        'Ext.form.RadioGroup',
        'Ext.form.field.Radio',
        'Ext.form.field.ComboBox',
        'Ext.view.BoundList',
        'Ext.XTemplate',
        'Ext.form.field.Number',
        'Ext.form.field.Display',
        'Ext.form.Label'
    ],

    controller: 'permissionedit',
    viewModel: {
        type: 'permissionedit'
    },
    modelValidation: true,
    scrollable: 'true',
    bodyPadding: '10 10 10 10',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    bind: {
        title: '{thePermission.name}'
    },
    items: [
        {
            xtype: 'fieldcontainer',
            maxWidth: 700,
            layout: {
                type: 'hbox',
                align: 'stretch',
                pack: 'end'
            },
            items: [
                {
                    xtype: 'toolbar',
                    items: [
                        {
                            xtype: 'button',
                            baseCls: 'edit_save_btn',
                            overCls: 'edit_save_btn_over',
                            iconCls: '',
                            listeners: {
                                click: 'onPermissionSaveButtonClick'
                            }
                        },
                        {
                            xtype: 'button',
                            baseCls: 'edit_cancel_btn',
                            overCls: 'edit_cancel_btn_over',
                            iconCls: '',
                            listeners: {
                                click: 'onPermissionCancelButtonClick'
                            }
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'fieldset',
            maxWidth: 700,
            width: '',
            title: '상세 정보',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'textfield',
                    reference: 'permissionID',
                    fieldLabel: 'ID*',
                    allowBlank: false,
                    emptyText: '1~20자 이내의 ID를 입력하세요.',
                    maxLength: 20,
                    minLength: 1,
                    regex: /^[A-Za-z]/,
                    vtype: 'alphanum',
                    bind: {
                        value: '{thePermission.id}'
                    },
                    listeners: {
                        beforerender: 'onPermissionIDTextfieldBeforeRender'
                    }
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '이름*',
                    emptyText: '1~20자 이내의 이름을 입력하세요.',
                    maxLength: 20,
                    minLength: 1,
                    bind: {
                        value: '{thePermission.name}'
                    }
                },
                {
                    xtype: 'textareafield',
                    height: 60,
                    maxHeight: 60,
                    fieldLabel: '설명*',
                    emptyText: '1~1000자 이내의 설명을 입력하세요.',
                    maxLength: 1000,
                    minLength: 1,
                    bind: {
                        value: '{thePermission.description}'
                    }
                },
                {
                    xtype: 'fieldcontainer',
                    flex: 1,
                    fieldLabel: '획득방식*',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'radiogroup',
                            flex: 1,
                            reference: 'getMethod',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'fieldcontainer',
                                    height: '',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    items: [
                                        {
                                            xtype: 'radiofield',
                                            maxWidth: 80,
                                            width: 80,
                                            name: 'method',
                                            boxLabel: '기본 소유',
                                            inputValue: 'basic_type'
                                        },
                                        {
                                            xtype: 'button',
                                            baseCls: 'edit_tooltip_btn',
                                            margin: '0 0 0 10',
                                            overCls: 'edit_tooltip_btn_over',
                                            iconAlign: 'right',
                                            tooltip: '모든 사용자에게 기본으로 주어지는 방식<br>\ (예: 모든 사용자에게 해당 권한 부여)'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    height: '',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    items: [
                                        {
                                            xtype: 'radiofield',
                                            maxWidth: 80,
                                            width: 80,
                                            name: 'method',
                                            boxLabel: 'Point',
                                            inputValue: 'point_type'
                                        },
                                        {
                                            xtype: 'button',
                                            baseCls: 'edit_tooltip_btn',
                                            margin: '0 0 0 10',
                                            overCls: 'edit_tooltip_btn_over',
                                            iconAlign: 'right',
                                            tooltip: '사용자가 특정 \'Point\'를 일정 수준 획득하여 얻어내는 방식<br>\ (예: \'사용자 포인트\'를 100점 획득 시, 해당 권한 부여)'
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            flex: 5,
                                            referenceHolder: false,
                                            layout: {
                                                type: 'hbox',
                                                align: 'stretch'
                                            },
                                            items: [
                                                {
                                                    xtype: 'combobox',
                                                    reference: 'pointComboBox',
                                                    margin: '0 10 0 10',
                                                    editable: false,
                                                    emptyText: 'Point List',
                                                    displayField: 'name',
                                                    store: 'Point',
                                                    valueField: 'id',
                                                    listeners: {
                                                        select: 'onPermissionPointComboboxSelect'
                                                    },
                                                    listConfig: {
                                                        xtype: 'boundlist',
                                                        itemSelector: 'div',
                                                        itemTpl: [
                                                            '<img src="{icon}" align=left width=20 height=20/> &nbsp; {name}'
                                                        ]
                                                    }
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    reference: 'pointMax',
                                                    margin: '0 10 0 10',
                                                    validateOnChange: false,
                                                    emptyText: 'Max',
                                                    listeners: {
                                                        change: 'onPermissionPointNumberfieldChange'
                                                    }
                                                },
                                                {
                                                    xtype: 'displayfield',
                                                    reference: 'maxPointDisplayField',
                                                    value: '/ Max Value'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    height: '',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    items: [
                                        {
                                            xtype: 'radiofield',
                                            flex: 1,
                                            maxWidth: 80,
                                            width: 80,
                                            name: 'method',
                                            boxLabel: 'Level',
                                            inputValue: 'level_type'
                                        },
                                        {
                                            xtype: 'button',
                                            baseCls: 'edit_tooltip_btn',
                                            margin: '0 0 0 10',
                                            overCls: 'edit_tooltip_btn_over',
                                            iconAlign: 'right',
                                            tooltip: '사용자가 특정 \'Level\'을 일정 수준 획득하여 얻어내는 방식<br>\ (예: \'사용자 레벨\'이 2레벨 이상일 경우, 해당 권한 부여)'
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            flex: 5,
                                            focusOnToFront: false,
                                            layout: {
                                                type: 'hbox',
                                                align: 'stretch'
                                            },
                                            items: [
                                                {
                                                    xtype: 'combobox',
                                                    margins: '',
                                                    reference: 'levelComboBox',
                                                    margin: '0 10 0 10',
                                                    editable: false,
                                                    emptyText: 'Level List',
                                                    displayField: 'name',
                                                    store: 'Level',
                                                    valueField: 'id',
                                                    listeners: {
                                                        select: 'onPermissionLevelComboboxSelect'
                                                    },
                                                    listConfig: {
                                                        xtype: 'boundlist',
                                                        itemSelector: 'div',
                                                        itemTpl: [
                                                            '<img src="{icon}" align=left width=20 height=20/> &nbsp; {name}'
                                                        ]
                                                    }
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    reference: 'levelMax',
                                                    margin: '0 10 0 10',
                                                    validateOnChange: false,
                                                    emptyText: 'Max',
                                                    listeners: {
                                                        change: 'onPermissionLevelfieldChange'
                                                    }
                                                },
                                                {
                                                    xtype: 'displayfield',
                                                    reference: 'maxLevelDisplayField',
                                                    value: '/ Max Value'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    height: '',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    items: [
                                        {
                                            xtype: 'radiofield',
                                            flex: 1,
                                            maxWidth: 80,
                                            width: 80,
                                            name: 'method',
                                            boxLabel: 'Status',
                                            inputValue: 'status_type'
                                        },
                                        {
                                            xtype: 'button',
                                            baseCls: 'edit_tooltip_btn',
                                            margin: '0 0 0 10',
                                            overCls: 'edit_tooltip_btn_over',
                                            iconAlign: 'right',
                                            tooltip: '사용자가 특정 \'Status\'를 일정 수준 획득하여 얻어내는 방식<br>\ (예: \'사용자 등급\'이 골드 이상일 경우, 해당 권한 부여)'
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            flex: 5,
                                            layout: {
                                                type: 'hbox',
                                                align: 'stretch'
                                            },
                                            items: [
                                                {
                                                    xtype: 'combobox',
                                                    margins: '',
                                                    reference: 'statusComboBox',
                                                    margin: '0 10 0 10',
                                                    editable: false,
                                                    emptyText: 'Status List',
                                                    displayField: 'name',
                                                    store: 'Status',
                                                    valueField: 'id',
                                                    listeners: {
                                                        select: 'onPermissionStatusComboboxSelect'
                                                    }
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    margins: '',
                                                    reference: 'subStatusComboBox',
                                                    margin: '0 10 0 10',
                                                    editable: false,
                                                    emptyText: 'Classes',
                                                    displayField: 'name',
                                                    store: 'StatusClass',
                                                    valueField: 'rank',
                                                    listeners: {
                                                        select: 'onPermissionSubStatusComboboxSelect'
                                                    },
                                                    listConfig: {
                                                        xtype: 'boundlist',
                                                        itemSelector: 'div',
                                                        itemTpl: [
                                                            '<img src="{icon}" align=left width=20 height=20/> &nbsp; {name}'
                                                        ]
                                                    }
                                                },
                                                {
                                                    xtype: 'displayfield',
                                                    reference: 'maxStatusDisplayField'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    height: '',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    items: [
                                        {
                                            xtype: 'radiofield',
                                            maxWidth: 80,
                                            width: 80,
                                            name: 'method',
                                            boxLabel: 'Mission',
                                            inputValue: 'mission_type'
                                        },
                                        {
                                            xtype: 'button',
                                            baseCls: 'edit_tooltip_btn',
                                            margin: '0 0 0 10',
                                            overCls: 'edit_tooltip_btn_over',
                                            iconAlign: 'right',
                                            tooltip: '사용자가 특정 \'Mission\'을 완료하여 얻어내는 방식<br>\ (예: \'로그인 하기 미션\'을 완료 했을 경우, 해당 권한 부여)'
                                        }
                                    ]
                                }
                            ],
                            listeners: {
                                change: 'onPermissionRadiogroupChange',
                                beforerender: 'onPermissionRadiogroupBeforeRender'
                            }
                        }
                    ]
                },
                {
                    xtype: 'textareafield',
                    flex: 1,
                    height: 60,
                    maxHeight: 60,
                    fieldLabel: 'API 사용방법',
                    editable: false
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            height: 120,
            maxWidth: 700,
            width: 700,
            layout: {
                type: 'hbox',
                align: 'stretch',
                pack: 'end'
            },
            items: [
                {
                    xtype: 'label',
                    style: {
                        color: 'red'
                    },
                    text: '(*)필수 입력'
                }
            ]
        }
    ],
    listeners: {
        deactivate: 'onPermissionFormDeactivate'
    }

});