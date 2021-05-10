<template>
  <div class="row q-mb-sm">
    <q-input
      outlined
      :value="name"
      @input="$emit('update:name',$event)"
      label="Note name"
      autofocus
      class="col"
      :rules="[val => !!val || 'Field is required']"
      ref="name"
    />
  </div>
</template>
<script>
export default {
  props: ["name"]
};
</script>