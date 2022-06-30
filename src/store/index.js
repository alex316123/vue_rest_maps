import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading:{
      titulo: '',
      estado: false,
      color: 'primary',
      
    },
    desserts: [],
    markers: [],
    markersUpdate: [],
    updateMarker: false,
    mapcenter: { lat: 23, lng: 102 }
  },
  getters:{
    mapcenter: state => state.mapcenter
  },
  mutations: {
    mostrarLoading(state,payload){
      state.loading.titulo = payload.titulo;
      state.loading.estado = payload.color;
      state.loading.estado = true;
    },
    ocultarLoading(state){
      state.loading.estado = false;
    },
    centrar(state,index){
      state.mapcenter = state.markers[index].position;
    }
  },
  actions: {
  },
  modules: {
  }
})
