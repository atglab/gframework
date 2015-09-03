/*
 * File: app/view/manager/badge/BadgeEditViewController.js
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

Ext.define('GFManager.view.manager.badge.BadgeEditViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.managerbadgebadgeedit',

    onCancelBadge: function() {
        var badge			= this.getViewModel().get('theBadge');
        var isDirtyBadge	= badge.dirty;
        if(isDirtyBadge)  {
            if(!badge.create) {
                Ext.getStore('Badge').rejectChanges();

                var badgeIcon = this.lookupReference('badgeIcon');
                this.onSelectedBadgeIcon(badgeIcon);

            }
        }
    },

    onSelectedBadgeIcon: function(component) {
        var badge	= this.getViewModel().get('theBadge');

        if(!badge.create) {
            if(badge.get('icon') == '/resources/images/badges/badge_01.png') {
                component.selModel.select(component.dataSource.data.items[0]);
            } else if(badge.get('icon') == '/resources/images/badges/badge_02.png') {
                component.selModel.select(component.dataSource.data.items[1]);
            } else if(badge.get('icon') == '/resources/images/badges/badge_03.png') {
                component.selModel.select(component.dataSource.data.items[2]);
            } else if(badge.get('icon') == '/resources/images/badges/badge_04.png') {
                component.selModel.select(component.dataSource.data.items[3]);
            } else if(badge.get('icon') == '/resources/images/badges/badge_05.png') {
                component.selModel.select(component.dataSource.data.items[4]);
            } else if(badge.get('icon') == '/resources/images/badges/badge_07.png') {
                component.selModel.select(component.dataSource.data.items[5]);
            } else if(badge.get('icon') == '/resources/images/badges/badge_08.png') {
                component.selModel.select(component.dataSource.data.items[6]);
            } else if(badge.get('icon') == '/resources/images/badges/badge_09.png') {
                component.selModel.select(component.dataSource.data.items[7]);
            } else if(badge.get('icon') == '/resources/images/badges/badge_10.png') {
                component.selModel.select(component.dataSource.data.items[8]);
            } else if(badge.get('icon') == '/resources/images/badges/badge_11.png') {
                component.selModel.select(component.dataSource.data.items[9]);
            } else if(badge.get('icon') == '/resources/images/badges/badge_airplane.png') {
                component.selModel.select(component.dataSource.data.items[10]);
            } else if(badge.get('icon') == '/resources/images/badges/badge_bicycle.png') {
                component.selModel.select(component.dataSource.data.items[11]);
            } else if(badge.get('icon') == '/resources/images/badges/badge_bus.png') {
                component.selModel.select(component.dataSource.data.items[12]);
            } else if(badge.get('icon') == '/resources/images/badges/badge_car.png') {
                component.selModel.select(component.dataSource.data.items[13]);
            } else if(badge.get('icon') == '/resources/images/badges/badge_login.png') {
                component.selModel.select(component.dataSource.data.items[14]);
            } else if(badge.get('icon') == '/resources/images/badges/badge_motorcycle.png') {
                component.selModel.select(component.dataSource.data.items[15]);
            } else if(badge.get('icon') == '/resources/images/badges/badge_write.png') {
                component.selModel.select(component.dataSource.data.items[16]);
            } else if(badge.get('icon') == '/resources/images/badges/badge_yacht.png') {
                component.selModel.select(component.dataSource.data.items[17]);
            } else if(badge.get('icon') == '/resources/images/badges/badge_recommend.png') {
                component.selModel.select(component.dataSource.data.items[18]);
            } else if(badge.get('icon') == '/resources/images/badges/badge_neighbor.png') {
                component.selModel.select(component.dataSource.data.items[19]);
            } else if(badge.get('icon') == '/resources/images/badges/badge_email.png') {
                component.selModel.select(component.dataSource.data.items[20]);
            } else if(badge.get('icon') == '/resources/images/badges/music_present_badge.png') {
                component.selModel.select(component.dataSource.data.items[21]);
            } else if(badge.get('icon') == '/resources/images/badges/music_recommend_badge.png') {
                component.selModel.select(component.dataSource.data.items[22]);
            } else if(badge.get('icon') == '/resources/images/badges/music_share_badge.png') {
                component.selModel.select(component.dataSource.data.items[23]);
            } else if(badge.get('icon') == '/resources/images/badges/badge_comment.png') {
                component.selModel.select(component.dataSource.data.items[24]);
            } else if(badge.get('icon') == '/resources/images/badges/badge_watch.png') {
                component.selModel.select(component.dataSource.data.items[25]);
            }


        }
    },

    onBadgeSaveButtonClick: function(button, e, eOpts) {
        var badgeEditTab = button.up('badgeedit');
        var me = this;


        var saveBadge = badgeEditTab.getViewModel().get('theBadge');

        if(saveBadge.create) {
            if(badgeEditTab.isValid()) {

                if(!saveBadge.id || !saveBadge.name || !saveBadge.description || !saveBadge.icon) {
                    Ext.toast({
                        title: 'Badge-저장 실패' ,
                        html: '필드값을 다시 확인해주세요.',
                        align: 't',
                        bodyPadding:10
                    });
                } else {
                    var badgeStore = Ext.getStore('Badge');
                    var badge = Ext.create('GFManager.model.Badge');

                    badge.set('id', saveBadge.id);
                    badge.set('name', saveBadge.name);
                    badge.set('description', saveBadge.description);
                    badge.set('icon', saveBadge.icon);

                    badgeStore.add(badge);
                    badgeStore.save();
                    badgeStore.commitChanges();

                    badgeEditTab.close();

                    Ext.toast({
                        title: 'Badge-추가',
                        html: '새로운 Badge ('+ saveBadge.name+ ') 가 성공적으로 추가되었습니다.',
                        align: 't',
                        bodyPadding:10
                    });
                }
            } else {
                Ext.toast({
                    title: 'Badge-저장 실패' ,
                    html: '필드값을 다시 확인해주세요.',
                    align: 't',
                    bodyPadding:10
                });
            }

        } else {
            if(saveBadge.dirty) { 				//기존 Badge 정보 변경시
                if(badgeEditTab.isValid()) {	//기존 Badge 정보 검증
                    Ext.MessageBox.confirm('Badge-저장', saveBadge.get('name') + '의 정보가 변경되었습니다. 저장하시겠습니까?', function(btn){
                        if (btn == 'yes') {

                            saveBadge.save();

                            Ext.toast({
                                title: 'Badge-수정' ,
                                html: saveBadge.get('name') + '의 정보가 성공적으로 수정되었습니다.',
                                align: 't',
                                bodyPadding:10
                            });
                        } else {

                            me.onCancelBadge();
                        }
                    });
                } else {
                    Ext.toast({
                        title: 'Badge-저장 실패' ,
                        html: '필드값을 다시 확인해주세요.',
                        align: 't',
                        bodyPadding:10
                    });
                }
            }
        }
    },

    onBadgeCancelButtonClick: function(button, e, eOpts) {
        this.onCancelBadge();
    },

    onBadgeIDTextfieldBeforeRender: function(component, eOpts) {
        var badgeIDCmp		= this.lookupReference('badgeID');
        var isCreateBadge	= this.getViewModel().get('theBadge').create;

        if(isCreateBadge) {
            badgeIDCmp.setDisabled(false);
        } else {
            badgeIDCmp.setDisabled(true);
        }
    },

    onBadgeDataviewItemClick: function(dataview, record, item, index, e, eOpts) {
        this.getViewModel().set('theBadge.icon', record.getData().icon);
    },

    onDataviewBadgeAfterRender: function(component, eOpts) {
        this.onSelectedBadgeIcon(component);
    },

    onBadgeFormDeactivate: function(component, eOpts) {
        if(component.itemId == 'badge_edittab') {

        } else {
            if(!this.getViewModel().data.theBadge.dropped) {
                var badge		= this.getViewModel().get('theBadge');

                var isDirtyBadge	= badge.dirty;
                var isCreateBadge	= badge.create;
                var me = this;

                if(isDirtyBadge)  {

                    Ext.MessageBox.confirm('Badge-저장', badge.get('name')+'의 정보가 변경되었습니다. 저장하시겠습니까?', function(btn){
                        if (btn == 'yes') {

                            badge.save();

                            Ext.toast({
                                title: 'Badge-수정 완료' ,
                                html: badge.get('name') + '의 Badge정보가 성공적으로 수정되었습니다.',
                                align: 't',
                                bodyPadding:10
                            });
                        } else {
                            me.onCancelBadge();
                        }
                    });
                }
            }
        }
    }

});