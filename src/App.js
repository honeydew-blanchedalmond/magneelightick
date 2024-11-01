/* eslint-disable */
// @ts-nocheck
import './App.css';
import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useState } from "react";
import * as THREE from 'three';
import * as baffer from '../src/otsiuda_bafaemsya';
import Dai_Bog_Zdoroviya from './bozhe_pomozhy';


function App() {
  const [metki_peremetki, set_metki_peremetki] = useState([])
  const [pidsvicheni_celly, set_pidsvicheni_celly] = useState([])
  const [shukau_shlyah_dodomu_po_ostatkah_goinosti, set_shukau_shlyah_dodomu_po_ostatkah_goinosti] = useState([])
  const [chy_blyskae, set_chy_blyskae] = useState(true);
  const [hovaisya_bo_blyskae, set_hovaisya_bo_blyskae] = useState(false);

  const teritoriya_putannya = {
    yak_zashyroko_zaplutalo: 63,
    yak_zavysoko_zaplutalo: 63
  }

  const standart_goyana = 15;
  const rozmir_banochky = standart_goyana / teritoriya_putannya.yak_zashyroko_zaplutalo;

  const naskilki_zadulo_z_vikna = Math.floor(teritoriya_putannya.yak_zashyroko_zaplutalo / 2) * rozmir_banochky;
  const naskilki_zahotilosya_chhnuty = Math.floor(teritoriya_putannya.yak_zavysoko_zaplutalo / 2) * rozmir_banochky;

  const gridosik = [];

  const kontrakt_po_woolsam = [1, 1, 1, 1, 1, 2, 3];

  const kuda_podnyalosya_tsunami = 7;

  const koef_otvlecheniy_ot_razvlecheniy = 60;
  const bystrota_vospominaniy = teritoriya_putannya.yak_zavysoko_zaplutalo * koef_otvlecheniy_ot_razvlecheniy;

  const lainovi_nastroiki = {
    stepchik_animeita: 4,
    kolir: '#696969'
  };

  const korobochni_nastroiki = {
    kolir: "#B5EAD7",
    general_opacity: 0.55
  };

  const grozovi_nastroiki = {
    kolir: "#B5EAD7",
    general_opacity: 0.55,
    koef_startovogo_zaryada: 0.25
  };

  let zaraz_blymne = false;

  const cell_gridosika = {
    stepchiki_suda: -1,

    tochki_na_celle: {},
    woolsy: {
      zverhu: false,
      pravoruch: false,
      pid_nyzom: false,
      i_otako_zliva: false,
    },

    de_ya_vbik: Number.MIN_SAFE_INTEGER,
    de_ya_vglyb: Number.MIN_SAFE_INTEGER,

    de_ya_zboku_buv: Number.MAX_SAFE_INTEGER,
    de_ya_opuskavsya: Number.MAX_SAFE_INTEGER
  }

  const startovi_cellchiki = [{
    ...cell_gridosika,
    de_ya_vbik: Math.floor(teritoriya_putannya.yak_zashyroko_zaplutalo / 2),
    de_ya_vglyb: 0,
    stepchiki_suda: 0,
  }]

  let cellchik_kuda_zalaitsorsil = {
    ...cell_gridosika,
    de_ya_vbik: Number.MAX_SAFE_INTEGER,
    de_ya_vglyb: Number.MAX_SAFE_INTEGER,
  }

  useEffect(() => {
    if (gridosik.length)
      return;

    malyara_vnezapno_pochalo_malyamazaty();
    set_metki_peremetki(malyarskie_metki_dostaem_s_karmana());

    zanimaem_malyarski_positions();
    posylaem_magneelightniy_signalchik(startovi_cellchiki);
    napominaem_sebe_o_goryachei_goynosti();

    prygadaemo_yak_banchyly_i_pokazhem_na_stini();
  }, [])

  const malyara_vnezapno_pochalo_malyamazaty = () => {
    for (let i = 0, rowchik_gridosika = []; i < teritoriya_putannya.yak_zavysoko_zaplutalo; i++, rowchik_gridosika = []) {
      for (let j = 0; j < teritoriya_putannya.yak_zashyroko_zaplutalo; j++) {
        const woolsy_navkolo_nas = {
          zverhu: i > 0 && gridosik[i - 1][j].woolsy.pid_nyzom,
          i_otako_zliva: j > 0 && rowchik_gridosika[j - 1].woolsy.pravoruch,
          pid_nyzom: false,
          pravoruch: false
        };

        const do_chogo_dobazarylys = kontrakt_po_woolsam[Math.floor(Math.random() * kontrakt_po_woolsam.length)];
        const skilky_vzhe_zamaliuvaly = woolsy_navkolo_nas.zverhu + woolsy_navkolo_nas.i_otako_zliva;
        const skilky_she_nam_bazaryty = Math.max(0, do_chogo_dobazarylys - skilky_vzhe_zamaliuvaly);

        const shukaem_key_po_yogo_brelochku = (obj, expression) => {
          let res = {};
          Object.keys(obj).map(k => { res[k] = k; });
          return expression(res);
        }

        const keys = [shukaem_key_po_yogo_brelochku(woolsy_navkolo_nas, x => x.pid_nyzom), shukaem_key_po_yogo_brelochku(woolsy_navkolo_nas, x => x.pravoruch)];
        !i && keys.push(shukaem_key_po_yogo_brelochku(woolsy_navkolo_nas, x => x.zverhu));
        !j && keys.push(shukaem_key_po_yogo_brelochku(woolsy_navkolo_nas, x => x.i_otako_zliva));

        const keys_poshafili = poshalil_s_kostyami(keys, skilky_she_nam_bazaryty);
        keys_poshafili.forEach(keychik => woolsy_navkolo_nas[keychik] = true);

        const cellchik = {
          ...cell_gridosika,
          woolsy: woolsy_navkolo_nas,

          de_ya_vbik: j,
          de_ya_vglyb: i
        };

        rowchik_gridosika.push(cellchik);
      }

      gridosik.push(rowchik_gridosika);
    }
  }

  function poshalil_s_kostyami(gridosichnyi_array, count = 0) {
    if (!count)
      return [];

    const array = JSON.parse(JSON.stringify(gridosichnyi_array));
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array.slice(0, count);
  }

  const malyarskie_metki_dostaem_s_karmana = () => {
    const metki = [];

    for (let i = 0; i < teritoriya_putannya.yak_zavysoko_zaplutalo; i++) {
      for (let j = 0; j < teritoriya_putannya.yak_zashyroko_zaplutalo; j++) {
        const pokazatel_metkosti = {
          yak_treba_provernutysya: j * rozmir_banochky - naskilki_zadulo_z_vikna,
          yak_treba_nam_nagnutysya: -i * rozmir_banochky + naskilki_zahotilosya_chhnuty
        }

        const cellchik = gridosik[i][j];
        cellchik.tochki_na_celle = {
          liva_verhnya: [pokazatel_metkosti.yak_treba_provernutysya, pokazatel_metkosti.yak_treba_nam_nagnutysya, 0],
          prava_verhnya: [pokazatel_metkosti.yak_treba_provernutysya + rozmir_banochky, pokazatel_metkosti.yak_treba_nam_nagnutysya, 0],
          liva_nyzhnya: [pokazatel_metkosti.yak_treba_provernutysya, pokazatel_metkosti.yak_treba_nam_nagnutysya - rozmir_banochky, 0],
          prava_nyzhnya: [pokazatel_metkosti.yak_treba_provernutysya + rozmir_banochky, pokazatel_metkosti.yak_treba_nam_nagnutysya - rozmir_banochky, 0]
        }

        const metko_rozstavlyaem_metochki = [
          { chy_maem_wools: !i && cellchik.woolsy.zverhu, de_maem_wools: [cellchik.tochki_na_celle.liva_verhnya, cellchik.tochki_na_celle.prava_verhnya] },
          { chy_maem_wools: cellchik.woolsy.pid_nyzom, de_maem_wools: [cellchik.tochki_na_celle.liva_nyzhnya, cellchik.tochki_na_celle.prava_nyzhnya] },
          { chy_maem_wools: cellchik.woolsy.pravoruch, de_maem_wools: [cellchik.tochki_na_celle.prava_verhnya, cellchik.tochki_na_celle.prava_nyzhnya] },
          { chy_maem_wools: !j && cellchik.woolsy.i_otako_zliva, de_maem_wools: [cellchik.tochki_na_celle.liva_verhnya, cellchik.tochki_na_celle.liva_nyzhnya] }
        ];

        metko_rozstavlyaem_metochki.forEach(({ chy_maem_wools, de_maem_wools }) => chy_maem_wools && metki.push(de_maem_wools));
      }
    }

    return metki;
  }

  const zanimaem_malyarski_positions = () => {
    startovi_cellchiki.forEach(cellchik => {
      gridosik[cellchik.de_ya_vglyb][cellchik.de_ya_vbik].stepchiki_suda = cellchik.stepchiki_suda;
    });
  }

  const posylaem_magneelightniy_signalchik = (current_cellchiky) => {
    for (let i = 0; i < current_cellchiky.length && !zaraz_blymne; i++) {
      const current_cellchik = gridosik[current_cellchiky[i].de_ya_vglyb][current_cellchiky[i].de_ya_vbik];

      if (current_cellchik.de_ya_vglyb == teritoriya_putannya.yak_zavysoko_zaplutalo - 1) {
        if (chy_blyskae) {
          cellchik_kuda_zalaitsorsil.stepchiki_suda < 0 && (cellchik_kuda_zalaitsorsil = current_cellchik);
          zaraz_blymne = true;

          return;
        }
      }

      const opredelyaem_po_signalu_de_nastupna_banochka = [
        {
          chue_banochku_chy_tyho: !current_cellchik.woolsy.zverhu && gridosik[current_cellchik.de_ya_vglyb - 1]?.[current_cellchik.de_ya_vbik]?.stepchiki_suda < 0,
          nastupna_banochka_ocya: gridosik[current_cellchik.de_ya_vglyb - 1]?.[current_cellchik.de_ya_vbik]
        },
        {
          chue_banochku_chy_tyho: !current_cellchik.woolsy.pid_nyzom && gridosik[current_cellchik.de_ya_vglyb + 1]?.[current_cellchik.de_ya_vbik]?.stepchiki_suda < 0,
          nastupna_banochka_ocya: gridosik[current_cellchik.de_ya_vglyb + 1]?.[current_cellchik.de_ya_vbik]
        },
        {
          chue_banochku_chy_tyho: !current_cellchik.woolsy.i_otako_zliva && gridosik[current_cellchik.de_ya_vglyb]?.[current_cellchik.de_ya_vbik - 1]?.stepchiki_suda < 0,
          nastupna_banochka_ocya: gridosik[current_cellchik.de_ya_vglyb]?.[current_cellchik.de_ya_vbik - 1]
        },
        {
          chue_banochku_chy_tyho: !current_cellchik.woolsy.pravoruch && gridosik[current_cellchik.de_ya_vglyb]?.[current_cellchik.de_ya_vbik + 1]?.stepchiki_suda < 0,
          nastupna_banochka_ocya: gridosik[current_cellchik.de_ya_vglyb]?.[current_cellchik.de_ya_vbik + 1]
        }
      ];

      opredelyaem_po_signalu_de_nastupna_banochka.forEach(({ chue_banochku_chy_tyho, nastupna_banochka_ocya }) => {
        if (chue_banochku_chy_tyho) {
          nastupna_banochka_ocya.stepchiki_suda = current_cellchik.stepchiki_suda + 1;
          nastupna_banochka_ocya.de_ya_zboku_buv = current_cellchik.de_ya_vbik;
          nastupna_banochka_ocya.de_ya_opuskavsya = current_cellchik.de_ya_vglyb;

          current_cellchiky.push(nastupna_banochka_ocya);
        }
      });

      current_cellchiky.splice(i--, 1);
    }
  }

  const napominaem_sebe_o_goryachei_goynosti = () => {
    const momenty_vid_yakyh_prypikalo = [cellchik_kuda_zalaitsorsil];
    const razglazhenyi_gridosik = gridosik.flat();

    for (let i = 0; momenty_vid_yakyh_prypikalo.at(0).stepchiki_suda > 0;) {
      const goryachiy_moment_iz_proshlogo = momenty_vid_yakyh_prypikalo.at(i);
      const kak_ya_zdes_okazalsya = razglazhenyi_gridosik.find(cellchik =>
        cellchik.de_ya_vbik == goryachiy_moment_iz_proshlogo.de_ya_zboku_buv &&
        cellchik.de_ya_vglyb == goryachiy_moment_iz_proshlogo.de_ya_opuskavsya);

      momenty_vid_yakyh_prypikalo.unshift(kak_ya_zdes_okazalsya);
    }

    set_shukau_shlyah_dodomu_po_ostatkah_goinosti([...momenty_vid_yakyh_prypikalo]);
  }



  const prygadaemo_yak_banchyly_i_pokazhem_na_stini = () => {
    const do_yakoi_banoochky_zmogly_fizichno_dostignuty = zaraz_blymne ? cellchik_kuda_zalaitsorsil.stepchiki_suda : Math.max(...gridosik.flat().map(cellchik => cellchik.stepchiki_suda)) + kuda_podnyalosya_tsunami;
    const vsi_malyarski_banochki_rozstavleni_po_svoih_miscyah = Array.from({ length: do_yakoi_banoochky_zmogly_fizichno_dostignuty + 1 }, (_, i) => i).map((stepchik_suda) => {
      const pidsvicheni_cellchiky = gridosik.flat().filter(cellik =>
        cellik.stepchiki_suda >= Math.max(0, stepchik_suda - kuda_podnyalosya_tsunami) &&
        cellik.stepchiki_suda <= stepchik_suda
      );

      pidsvicheni_cellchiky.push(stepchik_suda);
      return pidsvicheni_cellchiky;
    })

    zaraz_blymne && vsi_malyarski_banochki_rozstavleni_po_svoih_miscyah.push([]);

    vsi_malyarski_banochki_rozstavleni_po_svoih_miscyah.forEach((pidsvicheni_cellchiky, index) => {
      const perekurchik_i_pobig_dalshe_malyareivit = setTimeout(() => {
        set_pidsvicheni_celly(pidsvicheni_cellchiky);
      }, bystrota_vospominaniy * index / vsi_malyarski_banochki_rozstavleni_po_svoih_miscyah.length);
      return () => clearTimeout(perekurchik_i_pobig_dalshe_malyareivit);
    })

    if (chy_blyskae) {
      const ubirayus_poka_ne_spalilsya_ot_zhara = setTimeout(() => {
        set_hovaisya_bo_blyskae(true);
      }, bystrota_vospominaniy);
      return () => clearTimeout(ubirayus_poka_ne_spalilsya_ot_zhara);
    }
  }

  const naskolko_banochka_ushla = (pidsvicheni_cell, potochnyi_stepchik, ne_po_tsunami_a_po_groze = false) => {
    const yak_davno_banchylasya = potochnyi_stepchik - pidsvicheni_cell.stepchiki_suda;

    const naskolko_banochka_uhodit = ne_po_tsunami_a_po_groze ? ((1 - grozovi_nastroiki.koef_startovogo_zaryada) / potochnyi_stepchik) : (1 / kuda_podnyalosya_tsunami);
    const naskolko_uzhe_ushla = yak_davno_banchylasya * naskolko_banochka_uhodit;

    return naskolko_uzhe_ushla;
  }



  const Korobochki_z_podgonchikom_dlya_malyareiverskogo_sumashestviya = ({ pidsvicheni_celly }) => {

    const {
      odna_sutsilna_hapka,
      nagadalysya_za_banochku
    } = Dai_Bog_Zdoroviya.
      shvydenko_porahuu_geometrychnu_korobochnu_rozmalyovku(
        pidsvicheni_celly,
        korobochni_nastroiki.kolir,
        (cell, pochomu_rahuem) => naskolko_banochka_ushla(cell, pochomu_rahuem), true
      )

    return (nagadalysya_za_banochku &&
      <mesh geometry={odna_sutsilna_hapka}>
        <meshBasicMaterial attach="material" vertexColors transparent opacity={korobochni_nastroiki.general_opacity} />
      </mesh>
    );
  }

  const Shlyah_na_malyareivchik_zaplutanyi_ale_mozhna_protysnutys = ({ metki_peremetki }) => {

    const {
      mozhna_dvizhuvaty_dali,
      uves_lain_na_malyarskiy_doloni
    } = Dai_Bog_Zdoroviya.gadau_po_malyarskiy_doloni(
      metki_peremetki,
      lainovi_nastroiki
    )

    return (mozhna_dvizhuvaty_dali &&
      <lineSegments geometry={uves_lain_na_malyarskiy_doloni}>
        <lineBasicMaterial attach="material" color={lainovi_nastroiki.kolir} />
      </lineSegments>
    );
  }

  const Protysnulys_do_malyareivchika_i_blyskavychno_atzhygaem = ({ hovaisya_bo_blyskae }) => {

    const {
      odna_sutsilna_hapka,
      nagadalysya_za_banochku
    } = Dai_Bog_Zdoroviya.
      shvydenko_porahuu_geometrychnu_korobochnu_rozmalyovku(
        shukau_shlyah_dodomu_po_ostatkah_goinosti,
        korobochni_nastroiki.kolir,
        (cell, pochomu_rahuem) => naskolko_banochka_ushla(cell, pochomu_rahuem, true)        
      )

    return (nagadalysya_za_banochku && hovaisya_bo_blyskae &&
      <mesh geometry={odna_sutsilna_hapka}>
        <meshBasicMaterial attach="material" vertexColors transparent opacity={grozovi_nastroiki.general_opacity} />
      </mesh>
    );
  }

  return (
    <div id="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 15] }}
        onCreated={({ gl }) => {
          gl.setClearColor('#2F4F4F')
        }}
      >
        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        {useMemo(() => <Korobochki_z_podgonchikom_dlya_malyareiverskogo_sumashestviya pidsvicheni_celly={pidsvicheni_celly} />, [pidsvicheni_celly])}
        {useMemo(() => <Shlyah_na_malyareivchik_zaplutanyi_ale_mozhna_protysnutys metki_peremetki={metki_peremetki} />, [metki_peremetki])}
        {useMemo(() => <Protysnulys_do_malyareivchika_i_blyskavychno_atzhygaem hovaisya_bo_blyskae={hovaisya_bo_blyskae} />, [hovaisya_bo_blyskae])}

      </Canvas>
    </div>
  )
}

export default App;