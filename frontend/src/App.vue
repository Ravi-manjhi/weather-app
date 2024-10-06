<template>
  <main>
    <!-- date -->
    <div class="text-center mt-6 mb-6">
      <h2 class="text-xl font-semibold text-slate-800">
        {{
          new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        }}
      </h2>
    </div>
    <!-- search -->
    <div><SearchInput @place-data="addPlace" /></div>

    <!-- weather card -->
    <div
      class="grid md:grid-cols-2 gap-4 mt-8 items-center justify-center place-content-center"
    >
      <div v-for="(place, index) in places">
        <WeatherCard :place="place" :key="index" @delete-place="deletePlace" />
      </div>
    </div>
  </main>
</template>

<script setup>
import SearchInput from "./components/SearchInput.vue";
import { onMounted, ref } from "vue";
import WeatherCard from "./components/weatherCard.vue";
import { INITIAL_Data } from "./utils/initalData";
const places = ref([]);

function addPlace(data) {
  console.log(data);
  if (
    !places.value.some(
      (el) =>
        el.location.name === data.location.name &&
        el.location.country === data.location.country
    )
  ) {
    places.value.push(data);
  }
}

function deletePlace(name) {
  places.value = places.value.filter((el) => el.location.name !== name);
}

onMounted(() => {
  places.value.push(INITIAL_Data);
});
</script>
