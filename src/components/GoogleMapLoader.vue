<template>
  <div>
    <div
      class="google-map"
      ref="googleMap"
    ></div>
    <template v-if="Boolean(this.google) && Boolean(this.map)">
      <slot
        :google="google"
        :map="mapCom"
      />
    </template>
  </div>
</template>

<script>
import GoogleMapsApiLoader from "google-maps-api-loader";
import {mapState} from "vuex";

export default {
  props: {
    mapConfig: Object,
    apiKey: String
  },

  data() {
    return {
      google: null,
      map: null
    };
  },

  async mounted() {
    const googleMapApi = await GoogleMapsApiLoader({
      apiKey: this.apiKey
    });
    this.google = googleMapApi;
    this.initializeMap();
  },

  methods: {
    initializeMap() {
      const mapContainer = this.$refs.googleMap;
      this.map = new this.google.maps.Map(mapContainer, this.mapConfig);
    }
  },
  watch: {
    'mapcenter': function() {
      this.map.setCenter(this.mapcenter);
      this.map.setZoom(15);
    }
  },
  computed:{
    ...mapState(['mapcenter']),
    mapCom(){
      return this.map;
    }
  }
};
</script>

<style scoped>
.google-map {
  width: 100%;
  min-height: 100%;
}
</style>
