/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../Primitive.d.ts"/>
///<reference path="ISet.d.ts"/>
///<reference path="IEnumerableOrArray.d.ts"/>
import Type from "../Types";
import LinkedNodeList from "./LinkedNodeList";
import ArgumentException from "../Exceptions/ArgumentException";
import ArgumentNullException from "../Exceptions/ArgumentNullException";
import {forEach, empty as emptyEnumerator} from "./Enumeration/Enumerator";
import {using} from "../Disposable/Utility";
import {areEqual} from "../Compare";
import CollectionBase from "./CollectionBase";

const OTHER = 'other';

export default class Set<T extends Primitive>
extends CollectionBase<T>
implements ISet<T>, IDisposable
{

	constructor(source?:IEnumerableOrArray<T>)
	{
		super(null,areEqual);
		this._count = 0;
		this._importEntries(source);
	}

	private _registry:IMap<IMap<ILinkedNodeWithValue<T>>>;
	private _set:LinkedNodeList<ILinkedNodeWithValue<T>>;

	private _getSet():LinkedNodeList<ILinkedNodeWithValue<T>>
	{
		var s = this._set;
		if(!s) this._set = s = new LinkedNodeList<ILinkedNodeWithValue<T>>();
		return s;
	}

	private _count:number;
	protected getCount():number
	{
		return this._count;
	}

	exceptWith(other:IEnumerableOrArray<T>):void
	{
		if(!other) throw new ArgumentNullException(OTHER);

		var count = 0;
		forEach(other, v=>
		{
			count += this._removeInternal(v);
		});
		if(count) this._onModified();
	}

	intersectWith(other:IEnumerableOrArray<T>):void
	{
		if(!other) throw new ArgumentNullException(OTHER);

		if(other instanceof Set)
		{
			let s = this._set;
			if(s) s.forEach(n=>
			{
				if(!other.contains(n.value))
					this.remove(n.value);
			});
		}
		else
		{
			using(new Set(other), o=>this.intersectWith(o));
		}
	}

	isProperSubsetOf(other:IEnumerableOrArray<T>):boolean
	{
		if(!other) throw new ArgumentNullException(OTHER);

		return other instanceof Set
			? other.isProperSupersetOf(this)
			: using(new Set(other), o=> o.isProperSupersetOf(this));
	}

	isProperSupersetOf(other:IEnumerableOrArray<T>):boolean
	{
		if(!other) throw new ArgumentNullException(OTHER);

		var result = true, count:number;
		if(other instanceof Set)
		{
			result = this.isSupersetOf(other);
			count = other._count;
		}
		else
		{
			using(new Set<T>(), o=>
			{
				forEach(other, v=>
				{
					o.add(v); // We have to add to another set in order to filter out duplicates.
					return result = this.contains(v);
				});
				count = o._count;
			});
		}

		return result && this._count>count;
	}

	isSubsetOf(other:IEnumerableOrArray<T>):boolean
	{
		if(!other) throw new ArgumentNullException(OTHER);

		return other instanceof Set
			? other.isSupersetOf(this)
			: using(new Set(other), o=> o.isSupersetOf(this));
	}

	isSupersetOf(other:IEnumerableOrArray<T>):boolean
	{
		if(!other) throw new ArgumentNullException(OTHER);

		var result = true;
		forEach(other, v=>
		{
			return result = this.contains(v);
		});
		return result;
	}

	overlaps(other:IEnumerableOrArray<T>):boolean
	{
		if(!other) throw new ArgumentNullException(OTHER);

		var result = false;
		forEach(other, v => !(result = this.contains(v)));
		return result;
	}

	setEquals(other:IEnumerableOrArray<T>):boolean
	{
		if(!other) throw new ArgumentNullException(OTHER);

		return this._count==(
				other instanceof Set
					? other._count
					: using(new Set(other), o=> o._count))
			&& this.isSubsetOf(other);
	}

	symmetricExceptWith(other:IEnumerableOrArray<T>):void
	{
		if(!other) throw new ArgumentNullException(OTHER);

		if(other instanceof Set)
		{
			forEach(other, v=>
			{
				if(this.contains(v))
					this.remove(v);
				else
					this.add(v);
			});
		}
		else
		{
			using(new Set(other), o=>this.symmetricExceptWith(o));
		}
	}

	unionWith(other:IEnumerableOrArray<T>):void
	{
		this.importEntries(other);
	}

	protected _addInternal(item:T):boolean
	{
		if(!this.contains(item))
		{
			var type = typeof item;
			if(!Type.isPrimitive(type))
				throw new ArgumentException("item", "A Set can only index primitives.  Complex objects require a HashSet.");

			var r = this._registry;
			var t = r && r[type];
			if(!r) this._registry = r = {};
			if(!t) r[type] = t = {};
			var node:ILinkedNodeWithValue<T> = {value: item};
			this._getSet().addNode(node);
			t[<any>item] = node;
			++this._count;
			return true;
		}
		return false;
	}

	protected _clearInternal():number
	{
		var _ = this;
		_._count = 0;
		wipe(_._registry, 2);
		var s = _._set;
		return s ? s.clear() : 0;
	}

	protected _onDispose():void
	{
		super._onDispose();
		this._set = null;
		this._registry = null;
	}

	private _getNode(item:T):ILinkedNodeWithValue<T>
	{
		var r = this._registry, t = r && r[typeof item];

		return t && t[<any>item];
	}

	contains(item:T):boolean
	{
		return !(!this._count || !this._getNode(item));
	}
	
	protected _removeInternal(item:T, max:number = Infinity):number
	{
		if(max===0) return 0;

		var r    = this._registry,
		    t    = r && r[typeof item],
		    node = t && t[<any>item];

		if(node)
		{
			delete t[<any>item];
			var s = this._set;
			if(s && s.removeNode(node))
			{
				--this._count;
				return 1;
			}
		}

		return 0;
	}

	getEnumerator():IEnumerator<T>
	{
		var s = this._set;
		return s && this._count
			? LinkedNodeList.valueEnumeratorFrom<T>(s)
			: emptyEnumerator;
	}

	forEach(
		action:Predicate<T> | Action<T>,
		useCopy:boolean = false):void
	{
		if(useCopy) super.forEach(action, useCopy);
		else this._set.forEach((node, i)=>action(node.value, i));
	}

}

function wipe(map:IMap<any>, depth:number = 1):void
{
	if(map && depth)
	{
		for(var key of Object.keys(map))
		{
			var v = map[key];
			delete map[key];
			wipe(v, depth - 1);
		}
	}
}