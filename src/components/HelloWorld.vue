<template>
  <div>
    <v-app>
    <v-app-bar app
    color="blue"
    dense
    elevation="4"
    outlined
    rounded
  ></v-app-bar>

  <v-layout>
    <v-flex md4>
      <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Buscar"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :search="search"
    ></v-data-table>
  </v-card>
    </v-flex>
    <v-flex md8>
      <l-map style="height: 90%" :zoom="zoom" :center="center">
        <l-tile-layer :url="url"></l-tile-layer>
        <ul>
        <li v-for="(marker,i) in markers" :key="i">
            <l-marker :lat-lng="marker.position"></l-marker>
        </li>
      </ul>
        
      </l-map>
    </v-flex>
  </v-layout>
</v-app>
  </div>
</template>

<script>
  import axios from "axios";
  import {mapMutations} from "vuex";
  import L from 'leaflet';
  import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
  import { Icon } from 'leaflet';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
  

  export default {
    name: 'MyAwesomeMap',
    components: {
      LMap,
      LTileLayer,
      LMarker,
    },
    data(){
      return {
        search: '',
        headers: [
          { text: 'Unidad', value: 'unidad' },
          { text: 'ID', value: 'id' },
          { text: 'Fecha', value: 'fecha' },
          { text: 'Hora', value: 'hora' },
          { text: 'Estatus', value: 'estatus' },
          { text: 'Encendido', value: 'encendido' },
          { text: 'Motor', value: 'motor' },
          { text: 'Modelo', value: 'modelo' },
          { text: 'Marca', value: 'marca' },
          { text: 'Submarca', value: 'submarca' },
          { text: 'Color', value: 'color' },
          { text: 'Placas', value: 'placas' },
          { text: 'VIN', value: 'vin' },
          { text: 'Economico', value: 'economico' },
        ],
        desserts: [],
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        zoom: 15,
        center: [51.505, -0.159],
        markerLatLng: [51.504, -0.159],
        markers: []
      };
    },
    methods:{
      ...mapMutations(['mostrarLoading','ocultarLoading']),
      async getData(){
        const config = {
            headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDV0Rlc2Fycm9sbG8iLCJpc3MiOiJDeXJ1cyBXaXJlbGVzcyIsImlhdCI6IjE2NTU5MjA3MzIiLCJuYW1lIjoiVGVtcG9yYWwgRGVzYXJyb2xsbyAiLCJ1c2VyIjoiMjU0MiJ9.5-b7_tOGOLDm13H2_NYU-j1Obr41U36ZrErqLfpCVio` }
        };
        try{
          this.mostrarLoading({titulo:'Cargando',color:'secondary'})
          let datos = await axios.get(`http://gm3.cyrus.tech:8081/gm3.rest/api/units/lastposition/?search=`,config);
          let dataObj = datos.data.lastpositions;
          for (let index = 0; index < dataObj.length; index++) {
            const dataRowObj = dataObj[index];
            this.desserts.push({
              unidad: dataRowObj.una, 
              id: dataRowObj.uco,
              fecha: dataRowObj.upos.pldt.split('T')[0],
              hora: dataRowObj.upos.pldt.split('T')[1],
              estatus: '',
              encendido:dataRowObj.usta.uacc,
              motor: dataRowObj.usta.ueng,
              modelo: dataRowObj.ucar.cmdl,
              marca: dataRowObj.ucar.cbrd,
              submarca: dataRowObj.ucar.csbb,
              color: dataRowObj.ucar.ccol,
              placas: dataRowObj.ucar.cpla,
              vin: dataRowObj.ucar.cpla,
              economico: dataRowObj.ucar.econ
            });
            this.markers.push({
              position: [dataRowObj.upos.plat, dataRowObj.upos.plon]
            });
            console.log(dataRowObj);
          }
        }catch(err){
          console.log(err);
        }
        finally{
          this.ocultarLoading();
        }
      }
    },
    created(){
      this.getData();
    },  
  }
</script>

<style>
  html, body {
    height: 100%;
    margin: 0;
  }
</style>