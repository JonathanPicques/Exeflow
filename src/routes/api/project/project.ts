import type {Viewport} from '@xyflow/svelte';

import type {Graph} from '$lib/core/core';

export interface Project {
    id: string;
    name: string;
    image: string;
    content: Graph & {viewport?: Viewport};
}

export const postProject = async ({name}: Pick<Project, 'name'>) => {
    const response = await fetch(`/api/project`, {
        method: 'POST',
        body: JSON.stringify({name}),
        headers: {'Content-Type': 'application/json'},
    });

    return (await response.json()) as Project;
};

export const patchProject = async ({id, image, content}: Pick<Project, 'id' | 'image' | 'content'>) => {
    const response = await fetch(`/api/project/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({image, content}),
    });

    return (await response.json()) as {id: string};
};

export const deleteProject = async ({id}: Pick<Project, 'id'>) => {
    const response = await fetch(`/api/project/${id}`, {
        method: 'DELETE',
    });

    return (await response.json()) as {id: string};
};
