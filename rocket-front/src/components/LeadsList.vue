<template>
  <div>
    <a-card title="Сделки" :bordered="false" style="width: 100%">
      <template #extra>
        <a-input-search
          v-model:value="searchQuery"
          placeholder="input search "
          :loading="dataFetching"
          @search="goSearch"
        />
      </template>
      <a-table
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        :loading="dataFetching"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <span :style="{ 'background-color': record.status.back }">
              {{ record.status.name }}
            </span>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { getLeads } from "@/services/amocrmService";
import { IComposedLeadInfo } from "@/types/interfaces";

interface Status {
  name: string;
  id: number;
  back: string;
}

interface TableData {
  name: string;
  updated_at: string;
  created_at: string;
  price: string;
  status: Status;
  user: string;
}

const leads = ref<IComposedLeadInfo[]>([]);
const dataFetching = ref<boolean>(false);
const searchQuery = ref<string>("");

const fetchLeads = async (query?: string) => {
  dataFetching.value = true;
  try {
    const data = await getLeads(query);
    leads.value = data;
  } catch (error) {
    console.error("Failed to fetch leads:", error);
  } finally {
    dataFetching.value = false;
  }
};
const columns = ref([
  {
    title: "Название",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Бюджет",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Статус",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Дата создания",
    dataIndex: "updated_at",
    key: "updated_at",
  },
  {
    title: "Дата обновления",
    dataIndex: "updated_at",
    key: "updated_at",
  },
  {
    title: "Ответственный",
    dataIndex: "user",
    key: "user",
  },
]);

const tableData = computed<TableData[]>(() => {
  return leads.value.map((v) => {
    return {
      name: v.name,
      updated_at: formatDate(v.updated_at),
      created_at: formatDate(v.created_at),
      price: formatPrice(v.price),
      status: {
        name: v.pipe.status.name,
        id: v.pipe.status.id,
        back: v.pipe.status.color,
      },
      user: v.user.name,
    };
  });
});

function formatDate(ms: number): string {
  const date = new Date(ms);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
  }).format(value);
}

const goSearch = () => {
  if (searchQuery.value.length > 3) {
    fetchLeads(searchQuery.value);
  }
};

onMounted(() => {
  fetchLeads();
});
</script>
