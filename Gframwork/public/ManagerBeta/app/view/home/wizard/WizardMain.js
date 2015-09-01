/*
 * File: app/view/home/wizard/WizardMain.js
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

Ext.define('GFManager.view.home.wizard.WizardMain', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.wizardmain',

    requires: [
        'GFManager.view.home.wizard.WizardMainViewModel',
        'GFManager.view.home.wizard.WizardMainViewController',
        'Ext.form.Panel',
        'Ext.form.Label',
        'Ext.form.RadioGroup',
        'Ext.form.field.Radio',
        'Ext.toolbar.Toolbar',
        'Ext.tab.Tab'
    ],

    controller: 'wizardmain',
    viewModel: {
        type: 'wizardmain'
    },
    defaultListenerScope: true,
    border: false,
    cls: 'top_menu_color',
    componentCls: 'top_menu_color',
    height: 600,
    margin: '10 0 0 10',
    maxHeight: 600,
    maxWidth: 1000,
    padding: 3,
    width: 1000,
    bodyPadding: 30,
    activeTab: 0,

    items: [
        {
            xtype: 'form',
            reference: 'step1',
            height: 700,
            id: 'card-0',
            maxHeight: 700,
            maxWidth: 1100,
            width: 1100,
            title: 'Step1 &raquo',
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'end'
            },
            dockedItems: [
                {
                    xtype: 'label',
                    dock: 'top',
                    html: '<H1>Gamification Framework 마법사를 실행합니다!</H1> <br> <H2>Step 1 of 4</H2> <br><H2>첫 번째는 데이터 초기화 단계입니다.</H2> 아래 초기화 옵션을 선택하고 초기화 버튼을 클릭하세요.'
                },
                {
                    xtype: 'radiogroup',
                    dock: 'top',
                    reference: 'wizardRadio01',
                    margin: '20 0 0 0',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'radiofield',
                            reference: 'allDelete',
                            name: 'initData',
                            boxLabel: '모든 사용자 데이터를 삭제합니다.',
                            checked: true,
                            inputValue: 'all'
                        },
                        {
                            xtype: 'radiofield',
                            name: 'initData',
                            boxLabel: '사용자의 기본 정보는 남겨두고 사용자의 게임 데이터만 삭제합니다.',
                            inputValue: 'init'
                        }
                    ]
                },
                {
                    xtype: 'toolbar',
                    flex: 1,
                    dock: 'top',
                    items: [
                        {
                            xtype: 'button',
                            maxWidth: 100,
                            width: 100,
                            scale: 'large',
                            text: '초기화',
                            listeners: {
                                click: {
                                    fn: 'onInitialDataButtonClick',
                                    scope: 'controller'
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'label',
                    dock: 'top',
                    html: '초기화를 완료하신 후, 다음 단계로 넘어가세요.',
                    margin: '20 0 0 0'
                },
                {
                    xtype: 'container',
                    dock: 'bottom',
                    layout: {
                        type: 'hbox',
                        align: 'stretch',
                        pack: 'end'
                    },
                    items: [
                        {
                            xtype: 'button',
                            reference: 'next_btn1',
                            disabled: true,
                            itemId: 'card-next',
                            margin: '0 0 0 10',
                            scale: 'large',
                            text: '다음 &raquo'
                        }
                    ]
                }
            ],
            tabConfig: {
                xtype: 'tab',
                flex: 1,
                reference: 'wizardTabConfig1',
                shim: false,
                height: 50,
                maxHeight: 50,
                allowDepress: false
            }
        },
        {
            xtype: 'form',
            reference: 'step2',
            height: 700,
            id: 'card-1',
            maxHeight: 700,
            maxWidth: 1100,
            width: 1100,
            title: 'Step2 &raquo',
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'end'
            },
            dockedItems: [
                {
                    xtype: 'label',
                    dock: 'top',
                    html: '<H1>Gamification Framework 마법사를 실행합니다!</H1> <br> <H2>Step 2 of 4</H2> <br> <H2>두 번째는 게임 메카닉 추천 단계 입니다.</H2> <br> 아래 링크에 접속하여, 플레이어 타입을 분석하고 적합한 게임 메카닉과 웹 사이트를 추천 받으세요. <br><br> <a href="http://dev1.atglab.co.kr:3031/Client/" target="_blank"> http://dev1.atglab.co.kr:3031/Client/ </a> <br><br>  게임 메카닉 타입과 웹 사이트 분야를 추천 받으신 후, 다음 단계로 넘어가세요.'
                },
                {
                    xtype: 'container',
                    dock: 'bottom',
                    layout: {
                        type: 'hbox',
                        align: 'stretch',
                        pack: 'end'
                    },
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'card-prev',
                            scale: 'large',
                            text: '&laquo; 이전'
                        },
                        {
                            xtype: 'button',
                            itemId: 'card-next',
                            margin: '0 0 0 10',
                            scale: 'large',
                            text: '다음 &raquo'
                        }
                    ]
                }
            ],
            tabConfig: {
                xtype: 'tab',
                flex: 1,
                reference: 'wizardTabConfig2',
                disabled: true
            }
        },
        {
            xtype: 'form',
            reference: 'step3',
            height: 700,
            id: 'card-2',
            maxHeight: 700,
            maxWidth: 1100,
            width: 1100,
            title: 'Step3 &raquo',
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'end'
            },
            dockedItems: [
                {
                    xtype: 'label',
                    dock: 'top',
                    html: '<H1>Gamification Framework 마법사를 실행합니다!</H1> <br>  <H2>Step 3 of 4</H2> <br> <H2>세 번째는 게임 메카닉 생성 단계 입니다.</H2> <br> 이전 단계에서 추천 받은 게임 메카닉 타입을 기반으로한 웹사이트 분야를 아래 보기에서 선택하고, 생성 버튼을 클릭하세요. <br><br> 선택한 웹 사이트 분야에 맞는 기본 게임 메카닉 데이터가 자동으로 생성됩니다. '
                },
                {
                    xtype: 'radiogroup',
                    flex: 1,
                    dock: 'top',
                    reference: 'dataTypeRadioGroup',
                    margin: '20 0 0 0',
                    width: 400,
                    columns: 5,
                    items: [
                        {
                            xtype: 'radiofield',
                            name: 'dataType',
                            boxLabel: '1. 의류 관련',
                            checked: true,
                            inputValue: '1'
                        },
                        {
                            xtype: 'radiofield',
                            name: 'dataType',
                            boxLabel: '2. 음악 관련',
                            inputValue: '2'
                        },
                        {
                            xtype: 'radiofield',
                            name: 'dataType',
                            boxLabel: '3. 자동차 관련',
                            inputValue: '3'
                        },
                        {
                            xtype: 'radiofield',
                            name: 'dataType',
                            boxLabel: '4. 게임 관련',
                            inputValue: '4'
                        },
                        {
                            xtype: 'radiofield',
                            name: 'dataType',
                            boxLabel: '5. 여행 관련',
                            inputValue: '5'
                        },
                        {
                            xtype: 'radiofield',
                            name: 'dataType',
                            boxLabel: '6. 놀이동산 관련',
                            inputValue: '6'
                        },
                        {
                            xtype: 'radiofield',
                            name: 'dataType',
                            boxLabel: '7. 부동산 및 건물 관련',
                            inputValue: '7'
                        },
                        {
                            xtype: 'radiofield',
                            name: 'dataType',
                            boxLabel: '8. 영화 및 공연 관련',
                            inputValue: '8'
                        },
                        {
                            xtype: 'radiofield',
                            name: 'dataType',
                            boxLabel: '9. 블로그 관련',
                            inputValue: '9'
                        },
                        {
                            xtype: 'radiofield',
                            name: 'dataType',
                            boxLabel: '10. 종교 및 비영리 관련',
                            inputValue: '10'
                        },
                        {
                            xtype: 'radiofield',
                            name: 'dataType',
                            boxLabel: '11. 기본',
                            inputValue: '11'
                        }
                    ]
                },
                {
                    xtype: 'toolbar',
                    flex: 1,
                    dock: 'top',
                    margin: '20 0 0 0',
                    items: [
                        {
                            xtype: 'button',
                            maxWidth: 100,
                            width: 100,
                            scale: 'large',
                            text: '생성',
                            listeners: {
                                click: {
                                    fn: 'onCreateMechaButtonClick',
                                    scope: 'controller'
                                }
                            }
                        },
                        {
                            xtype: 'label',
                            text: '생성 완료 후, 다음 단계로 넘어가세요.'
                        }
                    ]
                },
                {
                    xtype: 'container',
                    dock: 'bottom',
                    layout: {
                        type: 'hbox',
                        align: 'stretch',
                        pack: 'end'
                    },
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'card-prev',
                            scale: 'large',
                            text: '&laquo; 이전'
                        },
                        {
                            xtype: 'button',
                            reference: 'next_btn3',
                            disabled: true,
                            itemId: 'card-next',
                            margin: '0 0 0 10',
                            scale: 'large',
                            text: '다음 &raquo'
                        }
                    ]
                }
            ],
            tabConfig: {
                xtype: 'tab',
                flex: 1,
                reference: 'wizardTabConfig3',
                disabled: true
            }
        },
        {
            xtype: 'form',
            reference: 'step4',
            height: 700,
            id: 'card-3',
            maxHeight: 700,
            maxWidth: 1100,
            width: 1100,
            title: 'Step4 &raquo',
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'end'
            },
            dockedItems: [
                {
                    xtype: 'label',
                    dock: 'top',
                    html: '<H1>Gamification Framework 마법사를 실행합니다!</H1> <br>  <H2>Step 4 of 4</H2> <br> <H2>수고하셨습니다.</H2> <br> Gamification Framework 의 기본 데이터 설정이 완료되었습니다.  <br><br> 상단 메뉴의 Manager 를 실행하여, 사용자 정보를 추가하거나 수정하고,  <br><br> 상세한 게임 메카닉 데이터를 설정하세요.'
                },
                {
                    xtype: 'container',
                    dock: 'bottom',
                    layout: {
                        type: 'hbox',
                        align: 'stretch',
                        pack: 'end'
                    },
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'card-prev',
                            scale: 'large',
                            text: '&laquo; 이전'
                        },
                        {
                            xtype: 'button',
                            itemId: 'submit_btn',
                            margin: '0 0 0 10',
                            scale: 'large',
                            text: '완료 &raquo'
                        }
                    ]
                }
            ],
            tabConfig: {
                xtype: 'tab',
                flex: 1,
                reference: 'wizardTabConfig4',
                disabled: true,
                frame: false
            }
        }
    ]

});