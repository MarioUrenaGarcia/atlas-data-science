---
id: relaciones-y-relaciones-de-equivalencia
titulo: Relaciones y relaciones de equivalencia
titulo_en: Relations and equivalence relations
alias:
  - relación binaria
  - relación de equivalencia
  - clases de equivalencia
  - conjunto cociente
modulo: 0
submodulo: '0.1'
orden: 16
nivel: basico
prerrequisitos:
  - producto-cartesiano
  - particiones-de-un-conjunto
etiquetas:
  - relaciones
  - equivalencia
  - clases
  - partición
  - orden
resumen: >
  Una relación en A es un conjunto de pares de A por A. Es de equivalencia si es reflexiva, simétrica y
  transitiva, y en ese caso divide a A en clases disjuntas de elementos equivalentes.
formula: '[a] = \{b \in A : a \sim b\}'
visualizacion:
  componente: RelationViz
  parametros:
    elementos: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    relacion: congruencia
    relaciones:
      - congruencia
      - misma-paridad
      - menor-o-igual
      - divide
      - cercania
    k: 3
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

En una planta de manufactura, dos piezas se consideran intercambiables si salieron del mismo lote. Esa relación tiene tres rasgos evidentes: toda pieza es intercambiable consigo misma; si la pieza A puede sustituir a la B, la B puede sustituir a la A; y si A es intercambiable con B y B con C, entonces A lo es con C. Gracias a esos tres rasgos, las piezas se agrupan naturalmente en lotes, y cada pieza pertenece a exactamente uno.

No toda relación funciona así. "Pesa menos que" no es simétrica: si A pesa menos que B, B no pesa menos que A. "Está a menos de un milímetro de diferencia de" es simétrica, pero no transitiva: A puede estar cerca de B, B cerca de C, y A lejos de C. Ninguna de esas dos relaciones produce grupos bien separados.

Las relaciones de equivalencia formalizan la idea de "ser iguales en cierto aspecto", y sus grupos, las clases de equivalencia, son la forma de tratar como un solo objeto todo lo que se considera igual.

## Definición

Una **relación** $R$ en un conjunto $A$ es un subconjunto $R \subseteq A \times A$; se escribe $a \mathrel{R} b$ si $(a, b) \in R$.

:::definicion[Propiedades de una relación]
- **Reflexiva:** $a \mathrel{R} a$ para todo $a \in A$.
- **Simétrica:** $a \mathrel{R} b \Rightarrow b \mathrel{R} a$.
- **Antisimétrica:** $a \mathrel{R} b \land b \mathrel{R} a \Rightarrow a = b$.
- **Transitiva:** $a \mathrel{R} b \land b \mathrel{R} c \Rightarrow a \mathrel{R} c$.
:::

Una **relación de equivalencia**, denotada $\sim$, es reflexiva, simétrica y transitiva. La **clase de equivalencia** de $a$ es $[a] = \{b \in A : a \sim b\}$, y el **conjunto cociente** es $A/{\sim} = \{[a] : a \in A\}$. Una relación reflexiva, antisimétrica y transitiva es un **orden parcial**.

## Cómo usar la visualización

La matriz tiene una fila y una columna por elemento, y la celda $(a, b)$ se colorea cuando $a \mathrel{R} b$. La reproducción llena la matriz celda por celda; al terminar, el panel indica qué propiedades se cumplen y, para las que fallan, marca en la matriz el primer contraejemplo. Si la relación es de equivalencia, se listan sus clases.

Con la congruencia módulo 3 aparecen tres clases: $\{1, 4, 7\}$, $\{2, 5, 8\}$ y $\{3, 6, 9\}$. Con "menor o igual" falla la simetría y se cumple la antisimetría: la matriz es triangular. Con la cercanía y k igual a 1 la simetría se cumple pero la transitividad falla, porque 1 está cerca de 2 y 2 de 3, pero 1 no está cerca de 3.

## Ejemplo

Una empresa de transporte clasifica 8 viajes por la hora de salida: $6{:}10$, $6{:}45$, $9{:}20$, $9{:}55$, $13{:}05$, $13{:}40$, $18{:}15$ y $18{:}50$. Se define $x \sim y$ si ambos salen dentro de la misma hora del reloj.

1. **Reflexiva:** cada viaje sale en su propia hora.
2. **Simétrica:** si $x$ y $y$ comparten hora, $y$ y $x$ también.
3. **Transitiva:** si $x$ y $y$ comparten hora, y $y$ y $z$ también, las tres salen en la misma hora.
4. Las clases son $\{6{:}10, 6{:}45\}$, $\{9{:}20, 9{:}55\}$, $\{13{:}05, 13{:}40\}$ y $\{18{:}15, 18{:}50\}$: cuatro bloques disjuntos que cubren los 8 viajes.
5. En cambio, "salir con menos de 40 minutos de diferencia" no es transitiva: con viajes a las $9{:}00$, $9{:}30$ y $10{:}00$, el primero se relaciona con el segundo y el segundo con el tercero, pero el primero y el tercero difieren 60 minutos.

## Propiedades

:::teorema[Clases y particiones]
Si $\sim$ es una relación de equivalencia en $A$, sus clases forman una partición de $A$. Recíprocamente, toda partición de $A$ define la relación de equivalencia "estar en el mismo bloque", cuyas clases son los bloques.
:::

:::demostracion
Cada $a \in [a]$ por reflexividad, así que las clases son no vacías y cubren $A$. Si $c \in [a] \cap [b]$, entonces $a \sim c$ y $b \sim c$; por simetría y transitividad $a \sim b$, y de nuevo por transitividad $[a] = [b]$. Así, dos clases o son iguales o son disjuntas.
:::

- $a \sim b$ si y solo si $[a] = [b]$.
- La congruencia módulo $k$ en $\mathbb{Z}$ tiene exactamente $k$ clases, los residuos $0, 1, \dots, k - 1$.
- Una relación es simétrica y antisimétrica a la vez solo si sus pares son de la forma $(a, a)$.

## Errores comunes

- **Suponer que la reflexividad se sigue de la simetría y la transitividad.** Esas dos propiedades solo dan $a \mathrel{R} a$ para los $a$ que están relacionados con algo.
- **Confundir antisimétrica con "no simétrica".** La igualdad es simétrica y antisimétrica a la vez.
- **Tomar la semejanza aproximada como equivalencia.** "Estar cerca" no es transitiva, y encadenar parecidos puede unir elementos muy distintos.
- **Olvidar que una clase se nombra con cualquiera de sus elementos.** $[1] = [4] = [7]$ en la congruencia módulo 3.

## Conexiones

Una relación es un subconjunto del [[producto-cartesiano]], y las funciones son un tipo especial de relación. La correspondencia entre clases y bloques enlaza este concepto con las [[particiones-de-un-conjunto]]. Los órdenes parciales organizan conjuntos como el [[conjunto-potencia]] con la contención. En estadística, agrupar observaciones por el valor de una variable categórica es tomar clases de equivalencia.
