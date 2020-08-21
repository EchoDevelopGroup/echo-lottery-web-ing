<template>
  <li class="user-item" :class="{ small: isSmall }">
    <div class="user-item-avatar-box" :class="{ small: isSmall }">
      <img :src="avatar" alt="头像" class="user-item-avatar" v-if="!isSmall" />
      <div class="user-item-status"></div>
    </div>

    <div class="user-item-main-box">
      <div class="user-item-name-box">
        <span class="user-item-name">{{ name }}</span>
        <div class="user-item-name-line" v-if="!isSmall"></div>
      </div>

      <div class="user-item-tag-box" v-if="!isSmall">
        <span class="user-item-tag">&gt; {{ tag }}</span>
      </div>
    </div>
  </li>
</template>

<script>
import defaultAvatar from '@/assets/default-avatar.png'

export default {
  name: 'UserItem',
  props: {
    avatar: {
      type: String,
      default: defaultAvatar
    },
    name: {
      type: String,
      default: '(这个人没有名字)'
    },
    tag: {
      type: String,
      default: '广告位招租'
    },
    size: {
      type: String,
      validator(val) {
        return val === 'normal' || val === 'small'
      },
      default: 'normal'
    }
  },
  computed: {
    isSmall() {
      return this.size === 'small'
    }
  }
}
</script>

<style>
.user-item {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  border: 1px dashed #000;
  width: 300px;
  margin-bottom: 10px;
  padding: 8px 12px;
  box-shadow: 10px 10px 0 #ff9fc6;
  background-color: #fff;
}
.user-item.small {
  padding: 0;
}
.user-item-avatar-box {
  position: relative;
  height: 60px;
  width: 60px;
}
.user-item-avatar-box.small {
  border-right: 1px dashed #000;
  padding: 5px;
  height: 16px;
  width: 16px;
}
.user-item-avatar-box.small .user-item-status {
  position: relative;
}
.user-item-avatar {
  display: block;
  box-sizing: border-box;
  height: 60px;
  width: 60px;
  border-radius: 50%;
}
.user-item-status {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #62ff3d;
}

.user-item-main-box {
  margin-left: 15px;
  display: flex;
  flex-direction: column;
}
.user-item-name-box {
  position: relative;
  padding-bottom: 3px;
  color: #000;
}
.user-item-name-line {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 120px;
  height: 1px;
  background-color: #000;
}
.user-item-name {
  font-weight: bold;
}
.user-item-tag-box {
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin-top: 6px;
  width: 200px;
  height: 31px;
  padding: 10px 12px;
  border-radius: 12px;
  background-image: url('~@/assets/name-tag.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
