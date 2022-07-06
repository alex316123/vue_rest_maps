<script>
import {mapState} from "vuex";

export default {
  data: () => ({
    marker1: '',
    marker2: ''
  }),
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
    updateMarker(newValue, oldValue) {
      let objetoresp = this.markersUpdate.filter(element => element.id == this.marker.id);
      this.marker1.setPosition(objetoresp.position);
      this.marker2.setPosition(objetoresp.position);
    },
  },
  mounted() {
    const { Marker } = this.google.maps;

    this.marker1 = new Marker({
      position: this.marker.position,
      marker: this.marker,
      map: this.map,
      zIndex:this.marker.index,
      icon: { 
        url: require("@/assets/image/"+this.marker.hash+".png"),
      },
    });
    this.marker2 = new Marker({
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
