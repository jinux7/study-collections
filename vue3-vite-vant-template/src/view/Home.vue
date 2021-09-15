<template>
  <div>
    home vuex -> count : {{ count }}
    <button @click="handleClick">click</button>
    <div class="width-compute">width</div>
    <van-button type="primary">主要按钮</van-button>
    <van-button type="success">成功按钮</van-button>
    <van-button type="default">默认按钮</van-button>
    <van-button type="warning">警告按钮</van-button>
    <van-button type="danger">危险按钮</van-button>
    <div>
      <van-form @failed="onFailed">
        <van-cell-group inset>
          <!-- 通过 pattern 进行正则校验 -->
          <van-field
            v-model="value1"
            label="文本"
            name="pattern"
            placeholder="正则校验"
            :rules="[{ pattern, message: '请输入正确内容' }]"
          />
          <!-- 通过 validator 进行函数校验 -->
          <van-field
            v-model="value2"
            name="validator"
            placeholder="函数校验"
            :rules="[{ validator, message: '请输入正确内容' }]"
          />
          <!-- 通过 validator 返回错误提示 -->
          <van-field
            v-model="value3"
            name="validatorMessage"
            placeholder="校验函数返回错误提示"
            :rules="[{ validator: validatorMessage }]"
          />
          <!-- 通过 validator 进行异步函数校验 -->
          <van-field
            v-model="value4"
            name="asyncValidator"
            placeholder="异步函数校验"
            :rules="[{ validator: asyncValidator, message: '请输入正确内容' }]"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </div>
    <div>
      <van-cell title="选择多个日期" :value="text" @click="show = true" />
    </div>
  </div>

</template>

<script lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { ref } from 'vue';
import { Toast } from 'vant';
export default {
  setup() {
    const store = useStore()
    console.log(store)
    const count = computed(() => store.state.count)
    const handleClick = () => {
      store.commit('add')
    }
    const text = ref('');
    const show = ref(false);
    const value1 = ref('');
    const value2 = ref('');
    const value3 = ref('');
    const value4 = ref('');
    const pattern = /\d{6}/;

    // 校验函数返回 true 表示校验通过，false 表示不通过
    const validator = (val) => /1\d{10}/.test(val);

    // 校验函数可以直接返回一段错误提示
    const validatorMessage = (val) => `${val} 不合法，请重新输入`;

    // 校验函数可以返回 Promise，实现异步校验
    const asyncValidator = (val) =>
      new Promise((resolve) => {
        Toast.loading('验证中...');

        setTimeout(() => {
          Toast.clear();
          resolve(/\d{6}/.test(val));
        }, 1000);
      });

    const onFailed = (errorInfo) => {
      console.log('failed', errorInfo);
    };
    return {
      count,
      handleClick,
      value1,
      value2,
      value3,
      value4,
      pattern,
      onFailed,
      validator,
      asyncValidator,
      text,
      show
    }
  },
}
</script>

<style lang="less" scoped>
.width-compute {
  font-size: 18px;
  width: 750px;
  line-height: 50px;
  color: #ffffff;
  background-color: red;
}
</style>>
