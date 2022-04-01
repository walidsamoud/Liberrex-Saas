<script>
import { Pie } from "vue-chartjs";

export default {
  extends: Pie,
  data: () => ({
    title: "PieChart",
    labels: [],
    total: [],
  }),
  methods:{
    renderPieChart(){
        this.data.forEach(obj => {
            this.labels.push(obj.service);
            this.total.push(obj.total);
        });
        this.renderChart(
            {
                labels: this.labels,

                datasets: [
                    {
                        backgroundColor: ["#2962FF", "#4fc3f7", "#36bea6", "#3688bf", "#4a36bf", "#a436bf", "#bf3636", "#8abf36", "#bfa136", "#bf6436", "#00393d"],
                        data: this.total
                    }
                ]
            },
            { responsive: true, maintainAspectRatio: false, height: 250 }
        );
    }
  },
  mounted() {
      this.renderPieChart();
  },
  watch: {
    data: {
        handler: function () {
            this.renderPieChart();
        }
    }
  },
  props: {
    data: Array
  }
};
</script>