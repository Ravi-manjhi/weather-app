<template>
  <div
    :class="[
      'text-white p-6 rounded-lg shadow-lg gap-2 relative overflow-hidden flex flex-col',
      weatherBackgroundClass,
    ]"
  >
    <!-- Location & time -->
    <div class="flex justify-between items-center">
      <div class="flex items-center justify-center gap-1">
        <i class="fa-solid fa-location-dot"></i>
        <h1 :class="weatherTextColor" class="text-2xl">
          {{ place.location.name }} - {{ place.location.country }}
        </h1>
      </div>
      <div class="flex items-center justify-center gap-1">
        <i class="fa-solid fa-clock"></i>
        <h1 :class="weatherTextColor" class="text-2xl">
          {{ new Date(place.location.localtime).getHours() % 12 }} :
          {{
            new Date(place.location.localtime).getMinutes() < 10
              ? `0${new Date(place.location.localtime).getMinutes()}`
              : new Date(place.location.localtime).getMinutes()
          }}
          {{
            new Date(place.location.localtime).getHours() % 12 >= 12
              ? "PM"
              : "AM"
          }}
        </h1>
      </div>
    </div>

    <!-- current weather -->
    <div
      class="w-full text-center flex-1 flex items-center justify-center flex-col backdrop-blur-sm rounded-lg"
    >
      <img
        :src="place.current.condition.icon"
        alt="icon"
        width="100"
        class="mx-auto"
      />
      <h1 :class="weatherTextColor" class="text-6xl ml-2">
        {{ Math.round(place.current.temp_c) }}&deg;
      </h1>
      <p :class="weatherTextColor" class="text-xl">
        {{ place.current.condition.text }}
      </p>
    </div>

    <BorderLine />

    <!-- forecast -->
    <div class="p-2 backdrop-blur-md rounded-md">
      <div v-for="(day, index) in place.forecast.forecastday" :key="index">
        <WeatherForecastDay :day="day" :class="weatherTextColor" />
        <div
          v-show="index < place.forecast.forecastday.length - 1"
          class="w-full bg-white p-[1px]"
        ></div>
      </div>
    </div>

    <!-- info -->
    <Transition name="fade">
      <div v-show="showDetails">
        <WeatherInfo
          :place="place"
          @close-info="showDetails = false"
          @remove-place="
            $emit('delete-place', place.location.name);
            showDetails = false;
          "
        />
      </div>
    </Transition>

    <!-- forecast btn -->
    <div class="flex justify-end items-center gap-1 mt-6">
      <button @click="showDetails = true" :class="weatherTextColor">
        More <i class="fa-solid fa-arrow-right text-sm -mb-px"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import BorderLine from "./BorderLine.vue";
import WeatherForecastDay from "./WeatherForecastDay.vue";
import WeatherInfo from "./WeatherInfo.vue";

// Define props (place object must be passed from parent)
const props = defineProps({
  place: Object,
});

const showDetails = ref(false);

// Computed property to map condition.text to background class
const weatherBackgroundClass = computed(() => {
  const condition = props.place.current.condition.text.toLowerCase();

  switch (condition) {
    case "clear":
      return "bg-clear";
    case "cloudy":
      return "bg-cloudy";
    case "rain":
      return "bg-rain";
    case "snow":
      return "bg-snow";
    case "mist":
      return "bg-mist";
    default:
      return "bg-default";
  }
});

// Computed property to map condition.text to text color class
const weatherTextColor = computed(() => {
  const condition = props.place.current.condition.text.toLowerCase();

  switch (condition) {
    case "rain":
    case "snow":
    case "mist":
      return "text-white";

    default:
      return "text-gray-500";
  }
});
</script>

<style scoped>
.bg-clear {
  background-image: url("/images/clear.png");
  background-size: cover;
  background-position: center;
}

.bg-cloudy {
  background-image: url("/images/cloudy.png");
  background-size: cover;
  background-position: center;
}

.bg-rain {
  background-image: url("/images/rain.png");
  background-size: cover;
  background-position: center;
}

.bg-snow {
  background-image: url("/images/snow.png");
  background-size: cover;
  background-position: center;
}
.bg-mist {
  background-image: url("/images/mist.png");
  background-size: cover;
  background-position: center;
}

.bg-default {
  background-image: url("/images/default.png");
  background-size: cover;
  background-position: center;
}

/* Additional transition styles for showing and hiding info */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
