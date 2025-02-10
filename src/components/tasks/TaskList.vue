<script setup lang="ts">
import InputElement from '@/components/elements/InputElement.vue';
import LabelElement from '@/components/elements/LabelElement.vue';
import { formatDate } from '@/utils/date';
import { ref, watch } from 'vue';
import InputgroupElement from '../elements/InputgroupElement.vue';
import SelectElement from '../elements/SelectElement.vue';
import TaskCard from './TaskCard.vue';

const filters = ref({
  startDate: '',
  endDate: '',
  priority: ''
});

const props = defineProps({
  tasks: {
    type: Object,
    required: true
  }
});

// From the tasks list, get the lowest and highest date
let minDates = [];
let maxDates = [];
for (const task of Object.values(props.tasks)) {
  if (task === undefined || task === null) continue;
  if (task.startDate === undefined || task.endDate === undefined) continue;
  minDates.push(new Date(task.startDate));
  maxDates.push(new Date(task.endDate));
}

// Get the lowest date from minDates
let earliestDate = new Date(Math.min(...minDates.map((date) => date.getTime())));
let latestDate = new Date(Math.max(...maxDates.map((date) => date.getTime())));

// add 10 days to latestDate
earliestDate.setDate(earliestDate.getDate() - 1);
latestDate.setDate(latestDate.getDate() + 1);

const bars = ref<
  Array<
    Array<{
      beginDate: string;
      endDate: string;
      ganttBarConfig: {
        id: any;
        label: string;
        style: { background: string; borderRadius: string; color: string };
      };
    }>
  >
>([]);

const randomBackgroundColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const filteredTasks = ref(Object.values(props.tasks));

const filterTasks = () => {
  const startDate = new Date(filters.value.startDate);
  const endDate = new Date(filters.value.endDate);
  const priority = filters.value.priority;

  filteredTasks.value = Object.values(props.tasks).filter((task) => {
    if (task === undefined || task === null) return false;
    if (task.startDate === undefined || task.endDate === undefined) return false;

    const taskStartDate = new Date(task.startDate);
    const taskEndDate = new Date(task.endDate);

    if (filters.value.startDate && taskStartDate < startDate) return false;
    if (filters.value.endDate && taskEndDate > endDate) return false;
    if (priority && task.priority !== priority) return false;

    return true;
  });
};

// get soonestTask to end
let soonestTask = filteredTasks.value.reduce((prev, current) =>
  prev.endDate < current.endDate ? prev : current
);

// Watch filters for changes and update filteredTasks accordingly
watch(filters, filterTasks, { deep: true });

// Watch filteredTasks for changes and update bars accordingly
watch(
  filteredTasks,
  (newTasks) => {
    bars.value = [];
    for (const task of newTasks) {
      if (task === undefined || task === null) continue;
      if (task.startDate === undefined || task.endDate === undefined) continue;
      bars.value.push([
        {
          beginDate: formatDate(task.startDate) + ' 00:00', // "2021-07-13 00:00
          endDate: formatDate(task.endDate) + ' 23:59', // "2021-07-13 23:59
          ganttBarConfig: {
            id: task._id,
            label: task.name,
            style: {
              background: randomBackgroundColor(),
              borderRadius: '20px',
              color: 'black'
            }
          }
        }
      ]);
    }
    if (newTasks.length === 0) {
      soonestTask = null;
      return;
    }
    soonestTask = newTasks.reduce((prev, current) =>
      prev.endDate < current.endDate ? prev : current
    );
  },
  { immediate: true }
);

const priorityOptions = [
  { value: '', label: 'Toutes' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' }
];
</script>

<template>
  <section class="">
    <h2 class="text-2xl font-bold">Filtrer les tâches</h2>
    <div class="mt-4">
      <InputgroupElement>
        <template #label>
          <LabelElement for="startDate">Date de début</LabelElement>
        </template>
        <template #input>
          <InputElement v-model="filters.startDate" type="date" id="startDate" />
        </template>
      </InputgroupElement>
      <InputgroupElement>
        <template #label>
          <LabelElement for="endDate">Date de fin</LabelElement>
        </template>
        <template #input>
          <InputElement v-model="filters.endDate" type="date" id="endDate" />
        </template>
      </InputgroupElement>
      <InputgroupElement>
        <template #label>
          <LabelElement for="priority">Priorité</LabelElement>
        </template>
        <template #input>
          <SelectElement v-model="filters.priority" :options="priorityOptions" id="priority" />
        </template>
      </InputgroupElement>
    </div>
  </section>

  <section class="flex flex-col gap-4 mt-4">
    <h2 class="text-2xl font-bold">Liste des tâches ({{ filteredTasks.length }})</h2>
    <p class="text-sm text-gray-500" v-if="soonestTask">
      Tâche la plus proche : {{ soonestTask.name }} ({{ formatDate(soonestTask.startDate) }})
    </p>
    <ul
      v-if="filteredTasks.length"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <li v-for="task in filteredTasks" :key="task._id">
        <TaskCard :task="task" />
      </li>
    </ul>

    <g-gantt-chart
      v-if="filteredTasks.length"
      :chart-start="earliestDate"
      :chart-end="latestDate"
      precision="day"
      bar-start="beginDate"
      bar-end="endDate"
    >
      <g-gantt-row v-for="(barList, index) in bars" :key="index" :bars="barList" />
    </g-gantt-chart>
  </section>
</template>
