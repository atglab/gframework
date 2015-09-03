/*
 * File: app/store/IsContinuous.js
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

Ext.define('GFManager.store.IsContinuous', {
    extend: 'Ext.data.Store',

    requires: [
        'GFManager.model.Template'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            storeId: 'IsContinuous',
            model: 'GFManager.model.Template',
            data: [
                {
                    id: 'true',
                    name: '연속'
                },
                {
                    id: 'false',
                    name: '불연속'
                }
            ]
        }, cfg)]);
    }
});