const tags = {
  '2_Pogoj_maska_napis_hlajenje': {
    props: {
      type: 'boolean'
    }
  },
  '2_Pogoj_maska_napis_ogrevanje': {
    props: {
      type: 'boolean'
    }
  },
  '2_Odtaljevanje_izhod': {
    props: {
      type: 'boolean'
    }
  },
  '2_PogojPGDT_Shema_in_tipalo_OK1': {
    props: {
      type: 'boolean'
    }
  },
  '2_PogojPGDT_Shema_in_tipalo_OK2': {
    props: {
      type: 'boolean'
    }
  },
  '2_PogojPGDT_Shema_in_tipalo_OK3': {
    props: {
      type: 'boolean'
    }
  },
  '2_PogojPGDT_Shema_in_tipalo_SV': {
    props: {
      type: 'boolean'
    }
  },
  '2_Tipalo_AF': {
    props: {
      type: 'boolean'
    }
  },
  '2_Temp_Prostora': {
    props: {
      type: 'float',
      cdegrees: true
    }
  },
  '2_Temp_Zunanja': {
    props: {
      type: 'float',
      cdegrees: true
    }
  },
  '2_Poti1': { // heat pump temperature
    props: {
      type: 'float',
      cdegrees: true
    }
  },
  '2_Poti3': { // water temperature 1st floor
    props: {
      type: 'float',
      cdegrees: true
    }
  },
  '2_Poti4': { // water temperature ground floor
    props: {
      type: 'float',
      cdegrees: true
    }
  },
  '2_Izrac_temp_TC': { // desired heat pump temperature
    props: {
      type: 'float',
      cdegrees: true
    }
  },
  '2_Vklop_C0': { // circulating pump status
    props: {
      type: 'boolean'
    }
  },
  '2_Temp_RF2': { // room temperature
    props: {
      type: 'float',
      cdegrees: true
    }
  },
  '2_Temp_RF3': {
    props: {
      type: 'float',
      cdegrees: true
    }
  },
  '2_Delovanje_MENI': {
    props: [],
    values: [
      'Normalno delovanje',
      'POČITNIŠKI REŽIM',
      'PARTY',
      'ECO'
    ]
  },
  '2_GESLO_PGDT_Vklop': {
    props: {
      type: 'boolean'
    }
  },
  '2_JE_ALARM': {
    props: {
      type: 'boolean'
    }
  },
  '2_CURRENT_HOUR': {
    props: {
      type: 'integer',
      min: 0,
      max: 23,
      zero_padded_length: 2
    }
  },
  '2_CURRENT_MINUTE': {
    props: {
      type: 'integer',
      min: 0,
      max: 59,
      zero_padded_length: 2
    }
  },
  '2_CURRENT_DAY': {
    props: {
      type: 'integer',
      min: 1,
      max: 31,
      zero_padded_length: 2
    }
  },
  '2_CURRENT_MONTH': {
    props: {
      type: 'integer',
      min: 1,
      max: 12,
      zero_padded_length: 2
    }
  },
  '2_CURRENT_YEAR': {
    props: {
      type: 'integer',
      min: 0,
      max: 99,
      zero_padded_length: 2
    }
  },
  '2_Vklop_ele_grelca_1': {
    props: {
      type: 'boolean'
    }
  },
  '2_Pogoj_ikona_ele_grelca_1': {
    props: {
      type: 'boolean'
    }
  },
  '2_Pogoj_ikona_ele_grelca_2': {
    props: {
      type: 'boolean'
    }
  },
  '2_Pogoj_ikona_ele_grelca_3': {
    props: {
      type: 'boolean'
    }
  },
  '2_Signal_PV': {
    props: {
      type: 'boolean'
    }
  },
  '2_Signal_EVU': {
    props: {
      type: 'boolean'
    }
  },
  '2_PogojPGDT_N_OSN_ON_OK1': { // floor heating status
    props: {
      type: 'boolean'
    }
  },
  '2_PogojPGDT_N_OSN_OFF_OK1': {
    props: {
      type: 'boolean'
    }
  },
  '2_PogojPGDT_N_OSN_ON_OK2': {
    props: {
      type: 'boolean'
    }
  },
  '2_PogojPGDT_N_OSN_OFF_OK2': {
    props: {
      type: 'boolean'
    }
  },
  '2_PogojPGDT_N_OSN_ON_OK3': {
    props: {
      type: 'boolean'
    }
  },
  '2_PogojPGDT_N_OSN_OFF_OK3': {
    props: {
      type: 'boolean'
    }
  },
  '2_PogojPGDT_N_OSN_ON_SV': { // water heating status
    props: {
      type: 'boolean'
    }
  },
  '2_PogojPGDT_N_OSN_OFF_SV': {
    props: {
      type: 'boolean'
    }
  },
  '2_Temp_prostor_dnevna': {
    props: {
      type: 'float',
      cdegrees: true
    }
  },
  '2_Temp_prostor_nocna': {
    props: {
      type: 'float',
      cdegrees: true
    }
  },
  '2_Zamik_krivulje_MK1': {
    props: {
      type: 'float'
    }
  },
  '2_Nagib_krivulje_MK1': {
    props: {
      type: 'float'
    }
  },
  '2_Temp_vode_sanitarna': {
    props: {
      type: 'float',
      cdegrees: true
    }
  },
  '2_Temp_vode_sanitarna_NIZJA': {
    props: {
      type: 'float',
      cdegrees: true
    }
  },
  '2_Temp_Zalog': {
    label: 'Temperatura zalogovnika',
    props: {
      type: 'float',
      cdegrees: true
    }
  },
  '2_Poti5': {
    label: 'Temp.sončnih kolektorjev',
    props: {
      type: 'float',
      cdegrees: true
    }
  },
  '2_Vklop_C3': {
    label: 'Stanje obt.črp.kolektorjev',
    props: {
      type: 'boolean'
    },
    values: [
      'Izklop',
      'Vklop'
    ]
  },
  '2_Pogoj_maska_pret_stik': {
    label: 'Stanje pretočnega stikala',
    props: [

    ],
    values: [
      'Ni pretoka',
      'Pretok O.K.'
    ]
  },
  '2_Rezim_delov_TC': {
    label: 'Stanje zunanje enote',
    props: [

    ],
    values: [
      'Izklop',
      'Ogrevanje',
      'Hlajenje',
      'Odtaljevanje'
    ]
  },
  '2_PRIKAZ_Reg_temp_vode': {
    label: 'Delovna moč zunanje enote',
    props: {
      type: 'float',
      suffix: '%'
    }
  },
  '2_Preklop_PV1': {
    label: 'Smer prekl.ventila',
    props: [

    ],
    values: [
    'Prostori',
    'Sanitarna voda'
    ]
  },
  '2_Zahtevana_RF_MK_1': {
    label: 'Želena prostorska temp',
    props: {
      type: 'float',
      cdegrees: true
    }
  },
  '2_Poti2': {
    label: 'Temperatura vtoka',
    props: {
      type: 'float',
      cdegrees: true
    }
  },
  '2_Temp_zelena_MK_1': {
    label: 'Želena temperatura vtoka',
    props: {
      type: 'float',
      cdegrees: true
    }
  },
  '2_Delovanje_MP1': {
    label: 'Stanje mešalnega ventila',
    props: [

    ],
    values: [
    'Izklop',
    'Odpiranje',
    'Zapiranje'
    ]
  },
  '2_Odstotki_odprtosti_MP1': {
    label: 'Odprtost mešalnega ventila',
    props: {
      type: 'float',
      suffix: '%'
    }
  },
  '2_Vklop_C1': {
    label: 'Stanje obtočne črpalke C1',
    props: {
      type: 'boolean'
    },
    values: [
      'Izklop',
      'Vklop'
    ]
  },
  '2_Zahtevana_RF_MK_2': {
    label: 'Želena prostorska temp',
    props: {
      type: 'float',
      cdegrees: true
    }
  },
  '2_Temp_VF2': {
    label: 'Temperatura vtoka',
    props: {
      type: 'float',
      cdegrees: true
    }
  },
  '2_Temp_zelena_MK_2': {
    label: 'Želena temperatura vtoka',
    props: {
      type: 'float',
      cdegrees: true
    }
  },
  '2_Delovanje_MP2': {
    label: 'Stanje mešalnega ventila',
    props: [

    ],
    values: [
      'Izklop',
      'Odpiranje',
      'Zapiranje'
    ]
  },
  '2_Odstotki_odprtosti_MP2': {
    label: 'Odprtost mešalnega ventila',
    props: {
      type: 'float',
      suffix: '%'
    }
  },
  '2_Vklop_C2': {
    label: 'Stanje obtočne črpalke C2',
    props: {
      type: 'boolean'
    },
    values: [
      'Izklop',
      'Vklop'
    ]
  },
  '2_Zahtevana_RF_DK_3': {
    label: 'Želena prostorska temp',
    props: {
      type: 'float',
      cdegrees: true
    }
  },
  '2_Izbira_Mitsubishi_Fujitsu': {
    label: 'Zunanja enota',
    props: {
      group_label: '* * *'
    },
    values: [
      '',
      'Mitsubishi',
      'Fujitsu'
    ]
  },
  '2_Izbira_mPC_pCO3': {
    label: 'Vgrajen regulator',
    values: [
      '',
      'UPC Kartica',
      'pCO3 Regulator'
    ]
  },
  '2_Zagon_opravlja_oseba': {
    label: 'FIRST START MADE BY'
  },
  '2_Dan_ZAGONA': {},
  '2_Mesec_ZAGONA': {},
  '2_Leto_ZAGONA': {
    props: {
      type: 'year'
    }
  },
  '2_Ura_ZAGONA': {},
  '2_Min_ZAGONA': {}
}

module.exports = tags
