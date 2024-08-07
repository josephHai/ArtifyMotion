<template>
  <div>
    <svg
      :width="`${width}`"
      viewBox="0 0 225 36"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <title>Loader</title>
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <!-- 设置颜色渐变动画 -->
          <stop offset="0%" style="stop-color: #ffffff; stop-opacity: 1">
            <animate
              attributeName="offset"
              values="0;1;1"
              :dur="`${duration}s`"
              keyTimes="0;0.4;1"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" style="stop-color: #3b3b3b; stop-opacity: 1">
            <animate
              attributeName="offset"
              values="0;1;1"
              :dur="`${duration}s`"
              keyTimes="0;0.4;1"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
        <linearGradient
          v-for="i in [2, 3, 4]"
          :key="i"
          :id="`grad${i}`"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" style="stop-color: #e6ff21; stop-opacity: 1">
            <!-- keyTimes: 0; 0.4 + (i - 2) * 0.1; 0.5 + (i - 2) * 0.1; 1-->
            <animate
              attributeName="offset"
              values="0;0;1;1"
              :dur="`${duration}s`"
              :keyTimes="`0;${0.2 + i * 0.1};${0.3 + i * 0.1};1`"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="0%" style="stop-color: #3b3b3b; stop-opacity: 1">
            <animate
              attributeName="offset"
              values="0;0;1;1"
              :dur="`${duration}s`"
              :keyTimes="`0;${0.2 + i * 0.1};${0.3 + i * 0.1};1`"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
      </defs>
      <g
        id="outer-container"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
      >
        <g
          id="inner-container"
          transform="translate(-116.000000, -168.000000)"
          fill="#3B3B3B"
          fill-rule="nonzero"
        >
          <g id="logo-light" transform="translate(112.500000, 154.000000)">
            <text
              fill="url(#grad1)"
              font-family="DINPro-Bold, DIN Pro"
              font-size="44.0769231"
              font-weight="bold"
              letter-spacing="-3.45701357"
            >
              <tspan x="0.0011040724" y="46">MEME</tspan>
            </text>
            <g id="group-fun" transform="matrix(1,0,0,1,120,13.6)">
              <polygon
                transform="matrix(1,0,0,1.06,0,-0.8)"
                id="path-f"
                fill="url(#grad2)"
                points="34.1,5.1 19.5,5.1 19.5,12.9 32,12.9 32,18.3 19.5,18.3 19.5,31.1 13.4,31.1 13.4,-0.3 34.1,-0.3"
              />
              <path
                transform="matrix(1,0,0,1.06,0,-0.8)"
                id="path-u"
                fill="url(#grad3)"
                d="M 43.9 9.7 C 43.9 18 50.6 24.7 58.9 24.7 C 67.2 24.7 73.9 18 73.9 9.7 L 79.9 9.7 C 79.9 21.3 70.5 30.7 58.9 30.7 C 47.3 30.7 37.9 21.3 37.9 9.7 L 43.9 9.7 Z M 37.5 -0.3 L 43.5 -0.3 L 43.5 5.2 L 37.5 5.2 L 37.5 -0.3 Z M 74.5 -0.3 L 80.6 -0.3 L 80.6 5.2 L 74.5 5.2 L 74.5 -0.3 Z"
              />
              <polygon
                transform="matrix(1,0,0,1.06,0,-0.8)"
                id="path-n"
                fill="url(#grad4)"
                points="108,31.1 102.5,31.1 90.1,11.9 90.1,31.1 83.9,31.1 83.9,-0.3 89.4,-0.3 101.8,18.9 101.8,-0.3 108,-0.3"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineComponent({
  name: 'IconLoading',
})

defineProps({
  width: {
    type: Number,
    default: 240,
  },
  duration: {
    type: Number,
    default: 4,
  },
})
</script>

<style scoped lang="less"></style>
