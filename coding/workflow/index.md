# 工作流

## 流程的建模与绘制

### 流程建模
> 关于流程建模这里有不同的标准，比如：

- BPMN(*) -> XML
- DMN
- CMMN
- UML

### 流程绘制
> 关于流程绘制，这里有一些工具：

- bpmn-js
- logicflow
- AntV G6
- Draw.io

这这些工具中，bpmn-js 是基于 BPMN 标准实现的，而其他工具则可能支持多种标准或者有自己的格式。
下面是绘制代码

```shell
# 安装bpmn-js
npm install bpmn-js
```


```js
// 1. 仅静态渲染
// 有一个xml的流程图文件default.bpmn
import bpmnXML from './default.bpmn?raw'
import BpmnJS from 'bpmn-js'

const container = document.querySelector('#app')
const viewer = new BpmnJS({
    container
})

await viewer.importXML(bpmnXML)


// 2. 可以交互
import bpmnXML from './default.bpmn?raw'
import BpmnModeler from 'bpmn-js/lib/Modeler'
// 加上样式
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-js.css'

const container = document.querySelector('#app')
const modeler = new BpmnModeler({
    container
})

await modeler.importXML(bpmnXML)

// 3. 导出XML
const btn = document.querySelector('#export')

btn.onclick = async () => {
    const  { xml } = await viewer.saveXML({ format: true })
    console.log(xml)
}

```

## 实现可执行的工作流

### 工作流引擎/平台

> 市面上常见的

- Activiti
- Camunda
- Flowable


如果要把引擎集成到项目中，需要做一些适配工作。
1. 如何定义一个可以被引擎识别的流程
    - 实现自定义的属性面板
    - 实现引擎的扩展属性
        - 读取
        - 写入
2. 传统前端要做的适配工作


实现的demo如下：

`default.bpmn`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
    xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
    xmlns:flowable="http://flowable.org/bpmn"
    targetNamespace="http://www.example.org/order-process"
    id="Definitions_1"
    targetNamespace="http://bpmn.io/schema/bpmn">

  <!-- 流程定义 -->
  <bpmn:process id="Process_1" name="Simple Process" isExecutable="true">

    <!-- 开始事件 -->
    <bpmn:startEvent id="StartEvent_1" name="开始">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>

    <!-- 用户任务 -->
    <bpmn:userTask id="UserTask_1" name="处理任务">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:userTask>

    <!-- 结束事件 -->
    <bpmn:endEvent id="EndEvent_1" name="结束">
      <bpmn:incoming>Flow_2</bpmn:incoming>
    </bpmn:endEvent>

    <!-- 顺序流 -->
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="UserTask_1"/>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="UserTask_1" targetRef="EndEvent_1"/>

  </bpmn:process>

</bpmn:definitions>
````

`main.vue`
```vue
<script setup>
import BpmnModeler from 'bpmn-js/lib/Modeler'
// 加上样式
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-js.css'
import { useTemplate } from 'vue'
import bpmnXML from './default.bpmn?raw'
import UserTaskPanel from './UserTaskPanel.vue'

const container = useTemplate('modeler')
const selectedUserTaskElement = ref(null)
const modeler = ref(null)


onMounted(() => {
    modeler.value = new BpmnModeler({
        container: container.value
    })

    await modeler.value.importXML(bpmnXML)

    // 获取有哪些事件
    // const listeners = modeler.get('eventBus')._listeners
    // console.log(listeners)

    modeler.value.on('selection.changed', (e) =>{
        if(e.newSelection.length === 1 && e.newSelection[0].type === 'bpmn:UserTask'){
            selectedUserTaskElement.value = e.newSelection[0]
            
        }else{
            selectedUserTaskElement.value = null
        }

    })
})

// 生成xml
const onToXML = async () => {
    const  { xml } = await modeler.value.saveXML({ format: true })
    console.log(xml)
}

</script>
<template>
    <div class="container">
        <div class="modeler" ref="modeler"></div>
        <div class="panel" v-if="selectedUserTaskElement">
            <UserTaskPanel :element="selectedUserTaskElement" :modeler="modeler"/>
        </div>
    </div>
    <el-button @click="onToXML">生成xml</el-button>
</template>
<style scoped> 
.container {
    width: 80%;
    height: 600px;
    margin: 0 auto;
}

.modeler{
    width: 100%;
    height: 100%;
}

.panel {
    width: 200px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    position: absolute;
    right: 0;
    top: 1px;
    bottom: 1px;
    background: #f6f7fa;
    padding: 1em;
    z-index: 999;
}
</style>
```

`UserTaskPanel.vue`
```vue
<script setup>
import { reactive, watch, toRaw } from 'vue'


const props = defineProps({
    element: {
        type: Object,
        required: true
    },
    modeler: {
        type: Object,
        required: true
    }
})

// 这里用的是假数据，正常来说这里是业务数据
const users = [
    { label: '张三', value: 'id1' },
    { label: '李四', value: 'id2' },
    { label: '王五', value: 'id3' },
]

const form = reactive({
    // 读取
    label: props.element.businessObject.name || '',
    userId: props.element.businessObject.get('flowable:assigned') || ''
})


watch(form,() => {
    // 写入
    const modeling= props.modeler.get('modeling')
    //updateProperties(元素， 属性对象)
    modeling.updateProperties(toRaw(props.element), {
        'name': form.label,
        'flowable:assigned': form.userId
    })
})
</script>
<template>
    <div class="user-task-panel">
        <el-form :model="form" label-width="auto" style="max-width: 600px">
            <el-form-item label="标签" label-position="top">
                <el-input v-model="form.label" />
            </el-form-item>
            <el-form-item label="制定用户" label-position="top">
                <el-select v-model="form.userId" placeholder="请选择用户">
                    <el-option
                        v-for="item in users"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>
```