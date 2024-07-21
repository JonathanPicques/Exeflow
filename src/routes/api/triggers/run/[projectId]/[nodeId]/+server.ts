import {writable} from 'svelte/store';
import {randomUUID} from 'crypto';
import {json, error} from '@sveltejs/kit';

import {insertLog} from '../../../log';
import {GraphContext, importPlugins} from '$lib/core/core';
import {executeTrigger, importServerPlugins} from '$lib/core/core.server';
import type {Graph} from '$lib/core/core';

import type {ProjectsId} from '$lib/supabase/gen/public/Projects';
import type {TriggerNode} from '$lib/core/graph/nodes';
import type {TriggersNodeId} from '$lib/supabase/gen/public/Triggers';

export const POST = async ({locals, params}) => {
    const trigger = await locals.db
        .selectFrom('triggers')
        .where('node_id', '=', params.nodeId as TriggersNodeId)
        .where('project_id', '=', params.projectId as ProjectsId)
        .executeTakeFirst();
    if (!trigger) throw error(404);

    const project = await locals.db
        .selectFrom('projects')
        .select(['id', 'content'])
        .where('id', '=', params.projectId as ProjectsId)
        .executeTakeFirst();
    if (!project) throw error(404);

    const {content} = project;
    const {nodes, edges} = content as Graph;

    const execId = randomUUID();
    const controller = new AbortController();
    const {actions, triggers} = await importPlugins();
    const {serverActions, serverTriggers} = await importServerPlugins();

    let index = 0;
    const context = new GraphContext({nodes: writable(nodes), edges: writable(edges), actions, triggers});
    for await (const step of executeTrigger({
        node: context.findNode(params.nodeId) as TriggerNode,
        signal: controller.signal,
        context,
        request: undefined,
        serverActions,
        serverTriggers,
    })) {
        insertLog(locals.db, {
            execId,
            nodeId: step.nodeId,
            pluginId: step.pluginId,
            projectId: params.projectId,
            //
            index: index++,
            config: step.config,
            results: step.results,
        });
    }

    return json({index});
};
