/*
 * File: app/view/manager/level/LevelEdit.js
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

Ext.define('GFManager.view.manager.level.LevelEdit', {
    extend: 'Ext.form.Panel',
    alias: 'widget.leveledit',

    requires: [
        'GFManager.view.manager.level.LevelEditViewModel',
        'GFManager.view.manager.level.LevelEditViewController',
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
        'Ext.grid.Panel',
        'Ext.grid.column.Number',
        'Ext.grid.plugin.RowEditing',
        'Ext.form.Label'
    ],

    controller: 'leveledit',
    viewModel: {
        type: 'leveledit'
    },
    modelValidation: true,
    scrollable: 'true',
    bodyPadding: '10 10 10 10',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    bind: {
        title: '{theLevel.name}'
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
                                click: 'onLevelSaveButtonClick'
                            }
                        },
                        {
                            xtype: 'button',
                            baseCls: 'edit_cancel_btn',
                            overCls: 'edit_cancel_btn_over',
                            iconCls: '',
                            listeners: {
                                click: 'onLevelCancelButtonClick'
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
            items: [
                {
                    xtype: 'textfield',
                    anchor: '100%',
                    reference: 'levelID',
                    fieldLabel: 'ID*',
                    allowBlank: false,
                    emptyText: '1~20자 이내의 ID를 입력하세요.',
                    maxLength: 20,
                    minLength: 1,
                    regex: /^[A-Za-z]/,
                    vtype: 'alphanum',
                    bind: {
                        value: '{theLevel.id}'
                    },
                    listeners: {
                        beforerender: 'onLevelIDTextfieldBeforeRender'
                    }
                },
                {
                    xtype: 'textfield',
                    anchor: '100%',
                    fieldLabel: '이름*',
                    emptyText: '1~20자 이내의 이름을 입력하세요.',
                    maxLength: 20,
                    minLength: 1,
                    bind: {
                        value: '{theLevel.name}'
                    }
                },
                {
                    xtype: 'textareafield',
                    anchor: '100%',
                    height: 60,
                    maxHeight: 60,
                    fieldLabel: '설명*',
                    emptyText: '1~1000자 이내의 설명을 입력하세요.',
                    maxLength: 1000,
                    minLength: 1,
                    bind: {
                        value: '{theLevel.description}'
                    }
                },
                {
                    xtype: 'radiogroup',
                    reference: 'relation_method',
                    fieldLabel: '연동방식*',
                    items: [
                        {
                            xtype: 'radiofield',
                            name: 'method',
                            boxLabel: 'Point',
                            inputValue: 'point_type'
                        },
                        {
                            xtype: 'radiofield',
                            name: 'method',
                            boxLabel: 'Mission',
                            inputValue: 'mission_type'
                        }
                    ],
                    listeners: {
                        change: 'onLevelRadiogroupChange',
                        beforerender: 'onLevelRadiogroupBeforeRender'
                    }
                },
                {
                    xtype: 'combobox',
                    anchor: '100%',
                    reference: 'relation_factor',
                    fieldLabel: '연동요소*',
                    editable: false,
                    emptyText: '연동요소를 리스트에서 선택하세요.',
                    displayField: 'name',
                    valueField: 'id',
                    bind: {
                        value: '{theLevel.relation_object}'
                    },
                    listeners: {
                        select: 'onRelationFactorComboboxSelect'
                    },
                    listConfig: {
                        xtype: 'boundlist',
                        itemSelector: 'div',
                        itemTpl: [
                            '<tpl if="{icon}">       ',
                            '    <img src="{icon}" align=left width=20 height=20/> &nbsp; {name}        ',
                            '<tpl else>							        ',
                            '    {name}            ',
                            '</tpl>'
                        ]
                    }
                },
                {
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'numberfield',
                            flex: 1,
                            fieldLabel: '최대 레벨*',
                            emptyText: '10',
                            minValue: 0,
                            bind: {
                                value: '{theLevel.max}'
                            }
                        },
                        {
                            xtype: 'combobox',
                            flex: 1,
                            reference: 'difficulty',
                            margin: '0 0 0 10',
                            fieldLabel: '난이도',
                            editable: false,
                            emptyText: '최상',
                            displayField: 'name',
                            store: [
                                [
                                    '5',
                                    '최상'
                                ],
                                [
                                    '4',
                                    '상'
                                ],
                                [
                                    '3',
                                    '중'
                                ],
                                [
                                    '2',
                                    '하'
                                ],
                                [
                                    '1',
                                    '최하'
                                ]
                            ],
                            valueField: 'id',
                            listeners: {
                                beforerender: 'onLevelComboboxBeforeRender'
                            }
                        },
                        {
                            xtype: 'combobox',
                            flex: 1,
                            hidden: true,
                            margin: '0 0 0 10',
                            fieldLabel: '업방식*',
                            emptyText: '누적',
                            displayField: 'name',
                            store: [
                                [
                                    'true',
                                    '누적'
                                ],
                                [
                                    'false',
                                    '차감'
                                ]
                            ],
                            valueField: 'id',
                            bind: {
                                value: '{theLevel.isCumulative}'
                            }
                        },
                        {
                            xtype: 'button',
                            margin: '0 0 0 10',
                            text: '불러오기',
                            listeners: {
                                click: 'onLevelLoadButtonClick'
                            }
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: '레벨 표*',
                    items: [
                        {
                            xtype: 'gridpanel',
                            stateful: true,
                            cls: 'panel_color',
                            modelValidation: false,
                            padding: '1 1 0 1',
                            columnLines: true,
                            deferRowRender: true,
                            enableColumnHide: false,
                            forceFit: true,
                            store: 'LevelEntity',
                            columns: [
                                {
                                    xtype: 'numbercolumn',
                                    sortable: true,
                                    align: 'center',
                                    dataIndex: 'level',
                                    text: '레벨',
                                    format: '0',
                                    editor: {
                                        xtype: 'numberfield'
                                    }
                                },
                                {
                                    xtype: 'numbercolumn',
                                    reference: 'condition',
                                    sortable: true,
                                    align: 'center',
                                    dataIndex: 'condition',
                                    text: '획득 조건',
                                    format: '0'
                                }
                            ],
                            plugins: [
                                {
                                    ptype: 'rowediting'
                                }
                            ],
                            listeners: {
                                itemclick: 'onLevelGridpanelItemClick'
                            }
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    disabled: true,
                    layout: 'fit',
                    title: '아이콘*',
                    items: [
                        {
                            xtype: 'dataview',
                            reference: 'levelIcon',
                            itemSelector: 'div.icon_repository',
                            itemTpl: [
                                '<tpl for=".">',
                                '    <div class="icon_repository">',
                                '            <img src="{icon}" width=70 height=70/>',
                                '    </div>',
                                '</tpl>'
                            ],
                            store: 'LevelIcon',
                            listeners: {
                                itemclick: 'onLevelDataviewItemClick',
                                afterrender: 'onDataviewLevelAfterRender'
                            }
                        }
                    ]
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
        show: 'onLevelFormShow',
        deactivate: 'onLevelFormDeactivate'
    }

});