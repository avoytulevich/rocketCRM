import { Injectable } from '@nestjs/common';
import axios from 'axios';
interface User {
  user_id: number;
  name: string;
}

interface Status {
  id: number;
  name: string;
  sort: number;
  is_editable: boolean;
  pipeline_id: number;
  color: string;
  type: number;
  account_id: number;
}

interface Pipeline {
  id: number;
  name: string;
  sort: number;
  is_main: boolean;
  is_unsorted_on: boolean;
  is_archive: boolean;
  account_id: number;
  _embedded?: {
    statuses: Status[];
  };
}

interface Lead {
  account_id: number;
  closed_at: string | null;
  closest_task_at: string | null;
  created_at: number;
  created_by: number;
  custom_fields_values: unknown | null;
  group_id: number;
  id: number;
  is_deleted: boolean;
  labor_cost: unknown | null;
  loss_reason_id: unknown | null;
  name: string;
  pipeline_id: number;
  price: number;
  responsible_user_id: number;
  score: unknown | null;
  status_id: number;
  updated_at: number;
  updated_by: number;
}
export interface ComposedLeadInfo {
  id: number;
  name: string;
  price: number;
  pipe: {
    id: number;
    name: string;
    status: Status;
  };
  created_at: number;
  updated_at: number;
  user: User;
}

@Injectable()
export class AmocrmService {
  private readonly baseUrl = `https://${process.env.AMOCRM_SUBDOMAIN}.amocrm.ru/api/v4`;
  private readonly token = process.env.TOKEN;
  private readonly config = {
    headers: {
      Authorization: `Bearer ${this.token}`,
    },
  };
  async computedLeadsInfo(query?: string): Promise<ComposedLeadInfo[]> {
    try {
      const pipelines: Pipeline[] = await this.getPipelines();
      const leads: Lead[] = await this.getLeads(query);
      const res: ComposedLeadInfo[] = [];
      const r_users: { [key: number]: User } = {};

      for (const l of leads) {
        const pipe =
          pipelines.find((p) => p.id === l.pipeline_id) || ({} as Pipeline);
        const status = pipe._embedded?.statuses.find(
          (st) => st.id === l.status_id,
        );
        let responsible_user = r_users[l.responsible_user_id];
        if (!responsible_user) {
          responsible_user = await this.getUserById(l.responsible_user_id);
          r_users[responsible_user.user_id] = responsible_user;
        }
        res.push({
          id: l.id,
          name: l.name,
          price: l.price,
          pipe: {
            id: l.pipeline_id,
            name: pipe.name || 'no_data',
            status,
          },
          created_at: l.created_at,
          updated_at: l.updated_at,
          user: responsible_user,
        });
      }
      return res;
    } catch (error) {
      console.error('Error computedLeadsInfo', error);
      throw error;
    }
  }

  async getLeads(query?: string): Promise<Lead[]> {
    try {
      let endpoint = `${this.baseUrl}/leads`;
      if (query && query.length >= 3) {
        endpoint += `?query=${encodeURIComponent(query)}`;
      }
      const response = await axios.get(endpoint, this.config);

      const {
        _embedded: { leads },
      } = response.data;
      return leads as Lead[];
    } catch (error) {
      console.error(
        'Error getLeads',
        error.response?.status,
        error.response?.statusText,
        error.message,
      );
      throw error;
    }
  }

  async getPipelines(): Promise<Pipeline[]> {
    try {
      const endpoint = `${this.baseUrl}/leads/pipelines`;
      const response = await axios.get(endpoint, this.config);
      const {
        _embedded: { pipelines },
      } = response.data;
      return pipelines as Pipeline[];
    } catch (error) {
      console.error(
        'Error getPipelines:',
        error.response?.status,
        error.response?.statusText,
        error.message,
      );
      throw error;
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const endpoint = `${this.baseUrl}/users/${id}`;
      const response = await axios.get(endpoint, this.config);
      const { id: user_id, name } = response.data;
      return { user_id, name };
    } catch (error) {
      console.error(
        'Error getPipelines:',
        error.response?.status,
        error.response?.statusText,
        error.message,
      );
      throw error;
    }
  }
}
