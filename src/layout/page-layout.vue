<template>
  <a-layout class="layout">
    <a-layout-sider v-if="menu" class="layout-sider" :breakpoint="'xl'" :collapsed="collapse" :collapsible="true"
      :width="menuWidth" :collapsed-width="menuWidth" :hide-trigger="true" @collapse="setCollapsed">
      <div class="menu-wrapper">
        <div class="left-side center">
          <User />
        </div>
        <Menu />
      </div>
    </a-layout-sider>

    <a-layout class="layout-content" :style="paddingStyle" style="box-sizing: border-box">
      <div v-if="navbar" class="layout-navbar" :style="{ height: navbarHeight }">
        <!-- <NavBar /> -->
        <AccountList></AccountList>
      </div>
      <a-layout-content class="main">
        <router-view v-slot="{ Component }">
          <keep-alive :include="cacheList">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </a-layout-content>
      <Footer v-if="footer" />
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAppStore, useUserStore } from '@/store';
import User from '@/components/user/index.vue';
import NavBar from '@/components/navbar/index.vue';
import AccountList from '@/components/account-list/index.vue';
import Menu from '@/components/menu/index.vue';
import Footer from '@/components/footer/index.vue';
import usePermission from '@/hooks/permission';

export default defineComponent({
  components: {
    Menu,
    User,
    NavBar,
    Footer,
    AccountList,
  },
  setup() {
    const appStore = useAppStore();
    const userStore = useUserStore();
    const router = useRouter();
    const route = useRoute();
    const permission = usePermission();
    const navbarHeight = `121px`; // 原60px
    const navbar = computed(() => appStore.navbar);
    const menu = computed(() => appStore.menu);
    const footer = computed(() => appStore.footer);
    const menuWidth = computed(() => {
      return appStore.menuCollapse ? 52 : appStore.menuWidth;
    });
    const collapse = computed(() => {
      return appStore.menuCollapse;
    });
    const paddingStyle = computed(() => {
      const paddingLeft = menu.value
        ? { paddingLeft: `${menuWidth.value}px` }
        : {};
      const paddingTop = navbar.value ? { paddingTop: navbarHeight } : {};
      return { ...paddingLeft, ...paddingTop };
    });
    const setCollapsed = (val: boolean) => {
      appStore.updateSettings({ menuCollapse: val });
    };

    const cacheList = computed(() => {
      return ['chat-page']
    })
    watch(
      () => userStore.role,
      (roleValue) => {
        if (roleValue && !permission.accessRouter(route))
          router.push({ name: 'notFound' });
      }
    );
    return {
      navbar,
      menu,
      footer,
      menuWidth,
      paddingStyle,
      collapse,
      navbarHeight,
      setCollapsed,
      cacheList
    };
  },
});
</script>

<style scoped lang="less">
@nav-size-height: 121px;
@layout-max-width: 1100px;

.arco-layout {
  width: 100%;
  height: 100%;
}

.layout-navbar {
  transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
  position: fixed;
  top: 0;
  left: 200px;
  z-index: 100;
  width: 100%;
  min-width: @layout-max-width;
  height: @nav-size-height;
}

.arco-layout-content.main {
  overflow: auto;
  height: calc(100% - @nav-size-height);
}

.layout-sider {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  height: 100%;
  padding-top: 0 !important;

  .left-side {
    display: flex;
    justify-content: center;
    // align-items: center;
    transition: none !important;
    width: 100%;
    height: 120px;
  }

  &::after {
    position: absolute;
    top: 0;
    right: -1px;
    display: block;
    width: 1px;
    height: 100%;
    background-color: var(--color-border);
    content: '';
  }

  > :deep(.arco-layout-sider-children) {
    overflow-y: hidden;
    top: 0;
  }
}

.menu-wrapper {
  transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
  height: 100%;
  overflow: auto;
  overflow-x: hidden;

  :deep(.arco-menu) {
    height: calc(100% - 120px) !important;
    transition: none;

    ::-webkit-scrollbar {
      width: 12px;
      height: 4px;
    }

    ::-webkit-scrollbar-thumb {
      border: 4px solid transparent;
      background-clip: padding-box;
      border-radius: 7px;
      background-color: var(--color-text-4);
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: var(--color-text-3);
    }
  }
}

.layout-content {
  min-width: @layout-max-width;
  min-height: 100vh;
  overflow-y: hidden;
  background-color: var(--color-fill-2);
  transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
}

.arco-layout-sider-collapsed {
  .left-side {
    width: 52px;

    .arco-typography {
      display: none;
    }
  }

  +.layout-content {
    .layout-navbar {
      left: 50px !important;

      .navbar {
        width: calc(100% - 50px) !important;
      }
    }
  }
}
</style>
