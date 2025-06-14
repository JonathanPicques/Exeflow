<script lang="ts">
    import {BaseEdge, EdgeLabel, useSvelteFlow, getSmoothStepPath} from '@xyflow/svelte';
    import type {EdgeProps} from '@xyflow/svelte';

    const {deleteElements} = useSvelteFlow();
    const {id, style, markerEnd, sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition}: EdgeProps = $props();
    const [path, labelX, labelY] = $derived(getSmoothStepPath({sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, borderRadius: 10}));

    const onEdgeClick = () => deleteElements({edges: [{id}]});
</script>

<BaseEdge {path} {style} {markerEnd} />
<EdgeLabel x={labelX} y={labelY} transparent={true}>
    <button class="custom nopan nodrag" onclick={onEdgeClick} aria-label="cut connection">
        <svg width="18" height="18" viewBox="0 0 18 18">
            <circle cx="9" cy="9" r="7" fill="#2d2d2d" stroke="currentColor" stroke-width="2" />
            <rect x="7.1817" y="12.0304" width="1.71429" height="6.85714" rx="0.857143" transform="rotate(-135 7.1817 12.0304)" fill="currentColor" />
            <rect x="5.96942" y="7.18176" width="1.71429" height="6.85714" rx="0.857143" transform="rotate(-45 5.96942 7.18176)" fill="currentColor" />
        </svg>
    </button>
</EdgeLabel>

<style>
    button {
        display: flex;
        padding: 0.5em 0.8em;
        justify-content: center;

        color: var(--color-fg);
        cursor: pointer;
        background-color: transparent;

        transition: transform 0.15s ease;

        &:hover {
            transform: scale(1.1);
        }
        &:active {
            color: var(--color-fg-1);
            transform: scale(0.95);
        }
    }
</style>
