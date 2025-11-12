import { useIntersectionObserver } from '@vueuse/core'

document.addEventListener('vue:loaded', (event) => {
    const vue = event?.detail?.vue
        vue.directive('item-list', {
            beforeMount(el, binding) {
                if ('intersection' in binding.modifiers) {
                    let threshold = binding.value.intersection ?? 50
                    const { stop } = useIntersectionObserver(
                        el,
                        (event) => {
                            if (event.some((e) => e.isIntersecting)) {
                                window.sendDataLayer('viewItemList',
                                    binding.value.items ?? [],
                                    binding.value.item_list_id ?? '',
                                    binding.value.item_list_name ?? '',
                                )
                                stop()
                            }
                        },
                        { threshold: threshold / 100 }
                    )
                    return
                }

                window.sendDataLayer('viewItemList',
                    binding.value.items ?? [],
                    binding.value.item_list_id ?? '',
                    binding.value.item_list_name ?? '',
                )
            },
        })
})