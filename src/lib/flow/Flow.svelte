<script lang="ts">
    import '@xyflow/svelte/dist/style.css';

    import {toPng} from 'html-to-image';
    import {Background, SvelteFlow, getNodesBounds, getViewportForBounds, useSvelteFlow} from '@xyflow/svelte';
    import type {Edge, Connection} from '@xyflow/svelte';

    import {valid} from '$lib/schema/validate';
    import CutEdge from '$lib/flow/edges/CutEdge.svelte';
    import ActionNode from '$lib/flow/nodes/Action.svelte';
    import TriggerNode from '$lib/flow/nodes/Trigger.svelte';
    import {layoutGraph} from '$lib/flow/dagre/dagre';
    import {getGraphContext} from '$lib/core/core';

    const {nodes, edges, createNode} = getGraphContext();
    const {fitView, getViewport, setViewport, screenToFlowPosition} = useSvelteFlow();

    const minZoom = 1;
    const maxZoom = 4;

    const edgeTypes = {edge: CutEdge};
    const nodeTypes = {action: ActionNode, trigger: TriggerNode};
    const defaultEdgeOptions = {type: 'edge'};

    export {getViewport, setViewport};

    export const layout = () => {
        const layout = layoutGraph({nodes: $nodes, edges: $edges});

        $nodes = layout.nodes;
        $edges = layout.edges;
        fitToView({smooth: false});
    };
    export const fitToView = ({smooth} = {smooth: true}) => {
        const duration = smooth && window.matchMedia(`(prefers-reduced-motion: no-preference)`).matches ? 300 : undefined;
        fitView({duration});
    };
    export const screenshot = async ({width = 320, height = 180} = {}) => {
        const viewport = getViewportForBounds(getNodesBounds($nodes), width, height, 0.1, 10, 0.2);
        const viewportElement = document.querySelector<HTMLElement>('.svelte-flow__viewport');

        if (viewport && viewportElement) {
            return await toPng(viewportElement, {
                width,
                height,
                //
                style: {
                    width: `${width}px`,
                    height: `${height}px`,
                    transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
                    backgroundColor: 'transparent',
                },
            });
        }
        return 'data:null';
    };

    const ondrop = async (e: DragEvent) => {
        e.preventDefault();

        if (!e.dataTransfer) {
            return null;
        }

        const id = e.dataTransfer.getData('application/exeflow+plugin:id');
        const type = e.dataTransfer.getData('application/exeflow+plugin:type');
        const position = screenToFlowPosition({x: e.clientX, y: e.clientY});

        if (valid(id, {type: 'string'}) && valid(type, {type: 'string', enum: ['action', 'trigger'] as const})) {
            await createNode(id, type, position);
        }
    };
    const ondragover = (e: DragEvent) => {
        e.preventDefault();

        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move';
        }
    };

    const onconnect = (connection: Connection) => {
        if (
            !connection.sourceHandle ||
            !connection.targetHandle ||
            $nodes.find(n => n.id === connection.target) === undefined ||
            $nodes.find(n => n.id === connection.source) === undefined
        ) {
            throw new Error(`onconnect invalid args`);
        }

        // FIXME: Make sure only one edge can exit from the source (right)
        // edges.update(edges => edges.filter(e => e.sourceHandle !== connection.sourceHandle || e.targetHandle === connection.targetHandle));
    };
    const isValidConnection = (connection: Edge | Connection) => {
        if (
            !connection.sourceHandle ||
            !connection.targetHandle ||
            $nodes.find(n => n.id === connection.source) === undefined ||
            $nodes.find(n => n.id === connection.target) === undefined
        ) {
            return false;
        }
        return true;
    };
</script>

<SvelteFlow {nodes} {nodeTypes} {edges} {edgeTypes} {defaultEdgeOptions} {minZoom} {maxZoom} {onconnect} {isValidConnection} {ondrop} {ondragover}>
    <Background />
</SvelteFlow>

<style>
    :global(.svelte-flow) {
        font-family: var(--flow-font);
        background-color: var(--color-bg) !important;
        --xy-background-pattern-dots-color-default: var(--flow-color-grid-dots);
    }

    :global(.svelte-flow__edge) :global(path),
    :global(.svelte-flow__connection) :global(path) {
        stroke: var(--flow-color-edge);
        stroke-width: 0.1rem;
    }

    :global(.svelte-flow__handle) {
        width: 0.5rem;
        height: 0.5rem;
        position: static;
        transform: none;
        border-width: 0.15rem;
        border-color: var(--x-color-plugin);
        background-color: var(--x-color-handle);
    }

    :global(.svelte-flow__handle.connectingto),
    :global(.svelte-flow__handle.connectingfrom) {
        --x-color-handle: var(--x-color-plugin);
    }

    :global(.svelte-flow__attribution) {
        visibility: hidden;
    }
</style>
