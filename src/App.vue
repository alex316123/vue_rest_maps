<template>
  <v-app>
    <v-main>
      <v-container>
        <v-layout>
          <v-flex md12 ma-4>
            <v-btn
              class="ma-2"
              :loading="carga"
              :disabled="carga"
              color="info"
              @click="update"
            >
              Actualizar
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon light>mdi-cached</v-icon>
                </span>
              </template>
            </v-btn>
          </v-flex>
        </v-layout>
        <v-layout>
          
          <v-flex md5 ma-4>
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
                  @click:row="handleClick"
                ></v-data-table>
              </v-card>
          </v-flex>
          <v-flex md7>
            <TravelMap class="travel-map"/>
          </v-flex>
        </v-layout>
        
        <v-dialog
          v-model="loading.estado"
          hide-overlay
          persistent
          width="300"
        >
          <v-card
            color="primary"
            dark
          >
            <v-card-text class="pt-3">
              {{loading.titulo}}
              <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

import {mapState,mapMutations} from "vuex";
import TravelMap from "./components/TravelMap";
import axios from "axios";

export default {
  name: 'App',
  components: {
    TravelMap
  },
  data: () => ({
    search: '',
    carga: false,
        headers: [
          { text: '#', value: 'index' },
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
        texto: 'AAA',
        resultado: '',
  }),
  computed:{
    ...mapState(['loading','desserts','markers','mapcenter','markersUpdate','updateMarker'])
  },
  mounted() {
    this.getData();
  },
  methods: {
    notEmpty(str) {
      if (str !== null && typeof str !== 'undefined' && str !== 'undefined' && str !== "" ) {
          return true;
      } else {
          return false;
      }
    },
    hashEncode(lastPositionDateTime, angle, motor, velocity, pin, selected = false){
      
        let currentDateTime = new Date();
        lastPositionDateTime = new Date(lastPositionDateTime);

        let diffMinues = Math.floor(parseInt((currentDateTime - lastPositionDateTime) / 1000) / 60), diffHours = '', diffDays = '';
        let seleccionado;
        selected ? seleccionado = 1 : seleccionado = 2;

        let hash = seleccionado.toString();
        hash = hash + pin;
        if (motor == 'ON' && velocity == 0) {
            hash = hash + "0";
        }
        else if ((!this.notEmpty(motor) || motor == 'ON') && velocity > 0) {
            hash = hash + "1";
        }
        else if (motor == 'OFF') {
            hash = hash + "2";
        }
        else if (!this.notEmpty(motor) && (!this.notEmpty(velocity) || velocity == 0)) {
            hash = hash + "3";
        }
        else {
            hash = hash + "3";
        }
        if (diffMinues <= 5) {
            hash = hash + "0";
        } else if (diffMinues > 5 && diffMinues <= 35) {
            hash = hash + "1";
        }
        if (diffMinues > 35) {
            diffHours = Math.floor(diffMinues / 60);
            if (diffHours <= 24) {
                hash = hash + "2";
            } else if (diffHours > 24 && diffHours <= 72) {
                hash = hash + "3";
            }
            if (diffHours > 72) {
                diffDays = Math.floor(diffHours / 24);
                if (diffDays <= 30) {
                    hash = hash + "4";
                } else if (diffDays > 30) {
                    hash = hash + "5";
                }
            }
        }

        if (angle != null && parseInt(angle) > 0) {
            if (parseInt(angle) >= 20 && parseInt(angle) <= 70) {
                hash = hash + "0";
            } else if (parseInt(angle) > 70 && parseInt(angle) < 110) {
                hash = hash + "1";
            } else if (parseInt(angle) >= 110 && parseInt(angle) <= 160) {
                hash = hash + "2";
            } else if (parseInt(angle) > 160 && parseInt(angle) < 200) {
                hash = hash + "3";
            } else if (parseInt(angle) >= 200 && parseInt(angle) <= 250) {
                hash = hash + "4";
            } else if (parseInt(angle) > 250 && parseInt(angle) < 290) {
                hash = hash + "5";
            } else if (parseInt(angle) >= 290 && parseInt(angle) <= 340) {
                hash = hash + "6";
            } else if (parseInt(angle) > 340 || parseInt(angle) < 20) {
                hash = hash + "7";
            }
        }
        else {
            hash = hash + "8";
        }

        return hash;
    
    },
    ...mapMutations(['centrar']),
    handleClick(value) {
        this.centrar(value.index);
    },
    async update(){
      this.carga = true;
      const config = {
            headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDV0Rlc2Fycm9sbG8iLCJpc3MiOiJDeXJ1cyBXaXJlbGVzcyIsImlhdCI6IjE2NTU5MjA3MzIiLCJuYW1lIjoiVGVtcG9yYWwgRGVzYXJyb2xsbyAiLCJ1c2VyIjoiMjU0MiJ9.5-b7_tOGOLDm13H2_NYU-j1Obr41U36ZrErqLfpCVio` }
      };
      try{
          let datos = await axios.get(`http://gm3.cyrus.tech:8081/gm3.rest/api/units/lastposition/?search=`,config);
          let dataObj = datos.data.lastpositions;
          console.log(dataObj);
          for (let index = 0; index < dataObj.length; index++) {
            const dataRowObj = dataObj[index];
            this.desserts.push({
              index: index,
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
            const modal = '';
            let positionMarker = modal === 'unitAssignment' ? (typeof dataRowObj.upos != 'undefined' ? dataRowObj.upos.pldt : typeof dataRowObj.lspo != 'undefined' ? dataRowObj.lspo : typeof dataRowObj.lpu != 'undefined' ? dataRowObj.lpu : 'red') : (typeof dataRowObj.upos != 'undefined' ? dataRowObj.upos.pldt : typeof dataRowObj.lspo != 'undefined' ? dataRowObj.lspo : typeof dataRowObj.ppo != 'undefined' ? dataRowObj.ppo : 'red');
            let motor = this.notEmpty(dataRowObj.usta) ? (this.notEmpty(dataRowObj.usta.uacc) ? dataRowObj.usta.uacc.toUpperCase() : (this.notEmpty(dataRowObj.acc) ? dataRowObj.acc.toUpperCase() : null)) : null;
            let velocity = this.notEmpty(dataRowObj.psp) ? Number(dataRowObj.psp) : Number(dataRowObj.spe);
            let hash = this.hashEncode(positionMarker, typeof dataRowObj.upos != 'undefined' ? dataRowObj.upos.phea : 0, motor, velocity, 0);
            let label = typeof dataRowObj.uco && dataRowObj.uco != '' && dataRowObj.uco != undefined ? dataRowObj.uco.substr(dataRowObj.uco.length - 3) : 'SD';
            
            this.markersUpdate.push({
              id:dataRowObj.index,
              position: { lat: dataRowObj.upos.plat, lng: dataRowObj.upos.plon },
              url: "https://apptecnored.com/TEST.php?Label=" + label,
              index: (index*2),
              hash: hash
            });
            
          }
          this.updateMarker = true;
        }catch(err){
          console.log(err);
        }
        this.carga = false;
    },
    async getData(){
      this.carga = true;
        const config = {
            headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDV0Rlc2Fycm9sbG8iLCJpc3MiOiJDeXJ1cyBXaXJlbGVzcyIsImlhdCI6IjE2NTU5MjA3MzIiLCJuYW1lIjoiVGVtcG9yYWwgRGVzYXJyb2xsbyAiLCJ1c2VyIjoiMjU0MiJ9.5-b7_tOGOLDm13H2_NYU-j1Obr41U36ZrErqLfpCVio` }
        };
        try{
          let datos = await axios.get(`http://gm3.cyrus.tech:8081/gm3.rest/api/units/lastposition/?search=`,config);
          let dataObj = datos.data.lastpositions;
          console.log(dataObj);
          for (let index = 0; index < dataObj.length; index++) {
            const dataRowObj = dataObj[index];
            this.desserts.push({
              index: index,
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
            const modal = '';
            let positionMarker = modal === 'unitAssignment' ? (typeof dataRowObj.upos != 'undefined' ? dataRowObj.upos.pldt : typeof dataRowObj.lspo != 'undefined' ? dataRowObj.lspo : typeof dataRowObj.lpu != 'undefined' ? dataRowObj.lpu : 'red') : (typeof dataRowObj.upos != 'undefined' ? dataRowObj.upos.pldt : typeof dataRowObj.lspo != 'undefined' ? dataRowObj.lspo : typeof dataRowObj.ppo != 'undefined' ? dataRowObj.ppo : 'red');
            let motor = this.notEmpty(dataRowObj.usta) ? (this.notEmpty(dataRowObj.usta.uacc) ? dataRowObj.usta.uacc.toUpperCase() : (this.notEmpty(dataRowObj.acc) ? dataRowObj.acc.toUpperCase() : null)) : null;
            let velocity = this.notEmpty(dataRowObj.psp) ? Number(dataRowObj.psp) : Number(dataRowObj.spe);
            let hash = this.hashEncode(positionMarker, typeof dataRowObj.upos != 'undefined' ? dataRowObj.upos.phea : 0, motor, velocity, 0);
            let label = typeof dataRowObj.uco && dataRowObj.uco != '' && dataRowObj.uco != undefined ? dataRowObj.uco.substr(dataRowObj.uco.length - 3) : 'SD';
            
            this.markers.push({
              id:dataRowObj.index,
              position: { lat: dataRowObj.upos.plat, lng: dataRowObj.upos.plon },
              url: "https://apptecnored.com/TEST.php?Label=" + label,
              index: (index*2),
              hash: hash
            });
            
          }
          this.centrar(index);
        }catch(err){
          console.log(err);
        }
        this.carga = false;
      }
      
  },
};
</script>
<style lang="scss" scoped>
  .travel-map {
    height: 500px;
  }
</style>
