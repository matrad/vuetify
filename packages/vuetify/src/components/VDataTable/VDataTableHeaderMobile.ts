import { VNode, VNodeChildrenArrayContents } from 'vue'
import mixins from '../../util/mixins'
import VSelect from '../VSelect/VSelect'
import VChip from '../VChip'
import header from './mixins/header'
import { wrapInArray } from '../../util/helpers'

export default mixins(header).extend({
  name: 'v-data-table-header-mobile',

  methods: {
    genSortChip (props: any) {
      const children: VNodeChildrenArrayContents = [props.item.text]

      const sortIndex = this.options.sortBy.findIndex(k => k === props.item.value)
      const beingSorted = sortIndex >= 0
      const isDesc = this.options.sortDesc[sortIndex]

      children.push(this.$createElement('div', {
        staticClass: 'v-chip__close',
        class: {
          sortable: true,
          active: beingSorted,
          asc: beingSorted && !isDesc,
          desc: beingSorted && isDesc,
        },
      }, [this.genSortIcon()]))

      return this.$createElement(VChip, {
        staticClass: 'sortable',
        nativeOn: {
          click: (e: MouseEvent) => {
            e.stopPropagation()
            this.$emit('sort', props.item.value)
          },
        },
      }, children)
    },
    genSortSelect () {
      const sortHeaders = this.headers.filter(h => h.sortable !== false && h.value !== 'data-table-select')

      return this.$createElement(VSelect, {
        props: {
          label: 'Sort by',
          items: sortHeaders,
          hideDetails: true,
          multiple: this.options.multiSort,
          value: this.options.multiSort ? this.options.sortBy : this.options.sortBy[0],
          disabled: sortHeaders.length === 0 || this.disableSort,
        },
        on: {
          change: (v: string | string[]) => this.$emit('sort', v),
        },
        scopedSlots: {
          selection: props => this.genSortChip(props) as any, // TODO: whyyy?
        },
      })
    },
  },

  render (h): VNode {
    const children: VNodeChildrenArrayContents = []

    const header = this.headers.find(h => h.value === 'data-table-select')
    if (header && !this.singleSelect) {
      children.push(this.$createElement('div', {
        class: [
          'v-data-table-header-mobile__select',
          ...wrapInArray(header.class),
        ],
        attrs: {
          width: header.width,
        },
      }, [this.genSelectAll()]))
    }

    children.push(this.genSortSelect())

    const th = h('th', {
      attrs: {
        colspan: this.headers.length,
      },
    }, [h('div', { staticClass: 'v-data-table-header-mobile__wrapper' }, children)])

    const tr = h('tr', [th])

    return h('thead', {
      staticClass: 'v-data-table-header v-data-table-header-mobile',
    }, [tr])
  },
})
