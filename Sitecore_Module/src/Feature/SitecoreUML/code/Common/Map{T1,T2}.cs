using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ZacharyKniebel.Feature.SitecoreUML.Common
{
    /// <summary>
    /// A bidirectional dictionary for performing forward (collection[key] -> value) or reverse
    /// (collection[value] -> key) lookups
    /// </summary>
    /// <remarks>
    /// Note that this class still has a concept of Key and Value, as it is this concept that is 
    /// used to define whether you are doing a forward or reverse lookup. 
    /// 
    /// This implementation was copied from https://stackoverflow.com/a/10966684/1506793 and tested
    /// thoroughly before use. 
    /// </remarks>
    /// <typeparam name="TKey">The type of the key</typeparam>
    /// <typeparam name="TValue">The type of the value</typeparam>
    public class Map<TKey, TValue>
    {
        // ReSharper disable once FieldCanBeMadeReadOnly.Local
        private Dictionary<TKey, TValue> _forward = new Dictionary<TKey, TValue>();
        // ReSharper disable once FieldCanBeMadeReadOnly.Local
        private Dictionary<TValue, TKey> _reverse = new Dictionary<TValue, TKey>();

        public Map()
        {
            this.Forward = new Indexer<TKey, TValue>(_forward);
            this.Reverse = new Indexer<TValue, TKey>(_reverse);
        }

        public class Indexer<TMapKey, TMapValue> 
        {
            // ReSharper disable once FieldCanBeMadeReadOnly.Local
            private Dictionary<TMapKey, TMapValue> _dictionary;
            public Indexer(Dictionary<TMapKey, TMapValue> dictionary)
            {
                _dictionary = dictionary;
            }
            public TMapValue this[TMapKey index]
            {
                get { return _dictionary[index]; }
                set { _dictionary[index] = value; }
            }
        }

        public void Add(TKey key, TValue value)
        {
            _forward.Add(key, value);
            _reverse.Add(value, key);
        }

        public Indexer<TKey, TValue> Forward { get; private set; }
        public Indexer<TValue, TKey> Reverse { get; private set; }

        public bool HasKey(TKey key) => _forward.ContainsKey(key);
        public bool HasValue(TValue value) => _reverse.ContainsKey(value);
    }
}