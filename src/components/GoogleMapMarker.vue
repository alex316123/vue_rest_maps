<script>
import {mapState} from "vuex";

export default {
  props: {
    google: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
    marker: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(['updateMarker','markersUpdate']),
    mapConfig(){
      return this.mapconfig;
    }
    
  },
  watch: {
    'updateMarker': function() {
      if(this.updateMarker){
        console.log("Actualiza");
      }
    }
  },
  mounted() {
    const { Marker } = this.google.maps;

    new Marker({
      position: this.marker.position,
      marker: this.marker,
      map: this.map,
      zIndex:this.marker.index,
      icon: { 
        url: require("@/assets/image/"+this.marker.hash+".png"),
      },
    });
    new Marker({
      position: this.marker.position,
      marker: this.marker,
      zIndex:(this.marker.index+1),
      map: this.map,
      icon: {
        url: this.marker.url,
        anchor: new google.maps.Point(17,70),
      },
    });
  },
  render() {}
};
</script>
