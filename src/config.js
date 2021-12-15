export default {
    MASTER_TEMPLATE: {
        order: 1,
        partnerId: '77075621',
        apiKey: '3_AJ2U75CHTxuS0P0wL9_d7og_KAGY1MPnKKXioIKzJBf_931YgBnRKis35gmy8MtU',
        ACLs: ['_admins', 'developers', 'mulesoft', 'standard_application']
    },
    SANDBOX: {
        order: 2,
        partnerId: '65296976',
        parentApiKey: {
            EU: '3_YYGtcNT2312QTAlvvaSuPUTl9nEnowZllOXXylK34x6AKSFbeg3yA4bi6awkPBQH', // marek_dev
            US: '3_7tcdyvdluQicCrENnW3QS8DF2RgqPRwwkHUdbAkPAzT_fFj7oY36azQR2NiEOMDM', // jakub_dev_2 
            CN: '', 
            RU: ''
        },
        ACLs: ['_admins', 'developers', 'mulesoft', 'standard_application']
    },
    DEV: {
        order: 3,
        partnerId: '71524330',
        parentApiKey: {
            EU: '3_BSI1NGp1Xi5rUSqa3cKCyT4w1xpPMSJ3GNE_uo-gv_fCjJ8IsRvc3jeOxs_5tkBp', 
            US: '3_2npgXgNwLLPD1ysNTDBstwa_WFSdbLXJ94rhnX3eTcMW7_u2Pk67rJpTBnFXd0f8', 
            CN: '', 
            RU: ''
        },
        ACLs: ['_admins', 'developers', 'mulesoft', 'standard_application']
    },
    TEST: {
        order: 4,
        partnerId: '44923402',
        parentApiKey: {
            EU: '3_zJd-t-fM7yiVS37vhCfC_XHSfY7Ij_vuXi8OLIe9_wXmqCkFJvKF96Tdxhfz6PGj', 
            US: '3_YV2D9-dfDpKhRKXW9DWFfb2YEplCjAPH3zX3xrngizC_7RaSV19p_iGD5pYJb8BF', 
            CN: '', 
            RU: ''
        },
        ACLs: ['_admins', 'developers', 'mulesoft', 'standard_application']
    },
    PROD: {
        order: 5,
        partnerId: '55994808',
        parentApiKey: {
            EU: '4_Lr3DInv7SdTLX9T_FsKKiQ', 
            US: '3_5rUFuJ_0CkYyhGpTxPHkT18wKeN-QLAN_5v0NWQtQv7XKUUd19e-PmzYTsBSOtOt', 
            CN: '', 
            RU: ''
        },
        ACLs: ['_admins', 'developers', 'mulesoft', 'standard_application']
    },
}
