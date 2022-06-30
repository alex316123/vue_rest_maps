<template>
    <GoogleMapLoader
            :mapConfig="mapConfig"
            :apiKey="apikey"
        >
            <template slot-scope="{ google, map }">
            <GoogleMapMarker
                v-for="marker in markers"
                :key="marker.id"
                :marker="marker"
                :google="google"
                :map="map"
            >
            </GoogleMapMarker>
            
            </template>
        </GoogleMapLoader> 
</template>

<script>
import GoogleMapLoader from "./GoogleMapLoader";
import GoogleMapMarker from "./GoogleMapMarker";
import GoogleMapLine from "./GoogleMapLine";
import { mapSettings } from "@/constants/mapSettings";
import {mapMutations, mapState} from "vuex";

export default {
  components: {
    GoogleMapLoader,
    GoogleMapMarker,
    GoogleMapLine
  },

  data() {
    return {
        apikey: 'AIzaSyB7jL231mLGMxkfOjmDARyYwk0zcSwSLQc',
        mapconfig: {}
    };
  },
    methods: {
      Config(){
        this.mapconfig = {
          ...mapSettings,
          center: this.mapcenter
        };
      }
    },
    mounted() {
        //this.getData();
    },
    created() {
      this.Config();
    },
  computed: {
    ...mapState(['markers','mapcenter']),
    mapConfig(){
      return this.mapconfig;
    }
    
  },
  watch: {
    'mapcenter': function() {
      this.mapconfig.center = this.mapcenter;
    }
  }
};
</script>
