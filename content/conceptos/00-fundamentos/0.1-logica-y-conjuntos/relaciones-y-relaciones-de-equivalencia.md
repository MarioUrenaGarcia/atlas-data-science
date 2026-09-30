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

Cada propiedad tiene una firma visual en el grafo de flechas, donde cada par $a \mathrel{R} b$ es una flecha de $a$ a $b$ y cada par $a \mathrel{R} a$ es un lazo.

:::figura[**Reflexiva.** "Misma paridad" pone un lazo en cada elemento, porque todo número tiene la misma paridad que sí mismo. "Menor que" no tiene ningún lazo: ningún número es menor que sí mismo, y el panel señala el primer elemento sin lazo.]{componente="RelationViz"}
```yaml
elementos: [1, 2, 3, 4, 5, 6]
relacion: misma-paridad
relaciones: [misma-paridad, menor]
vista: grafo
```
:::

:::figura[**Simétrica.** Con "a distancia de a lo más 1" toda flecha tiene su flecha de regreso. Con "menor o igual" las flechas van en un solo sentido: $1 \le 2$ pero no $2 \le 1$, y ese par se marca como contraejemplo.]{componente="RelationViz"}
```yaml
elementos: [1, 2, 3, 4, 5, 6]
relacion: cercania
relaciones: [cercania, menor-o-igual]
k: 1
vista: grafo
```
:::

:::figura[**Antisimétrica.** En "a divide a b" nunca hay flechas de ida y vuelta entre elementos distintos: si $a \mid b$ y $b \mid a$ con números positivos, entonces $a = b$. En "misma paridad" casi todas las flechas tienen regreso, así que no es antisimétrica.]{componente="RelationViz"}
```yaml
elementos: [1, 2, 3, 4, 5, 6]
relacion: divide
relaciones: [divide, misma-paridad]
vista: grafo
```
:::

:::figura[**Transitiva.** En "menor que", siempre que hay un camino de dos flechas $a \to b \to c$ también hay la flecha directa $a \to c$. En "a distancia de a lo más 1" existen $1 \to 2$ y $2 \to 3$ pero falta $1 \to 3$: el atajo que exige la transitividad no está.]{componente="RelationViz"}
```yaml
elementos: [1, 2, 3, 4, 5, 6]
relacion: menor
relaciones: [menor, cercania]
k: 1
vista: grafo
```
:::

Una **relación de equivalencia**, denotada $\sim$, es reflexiva, simétrica y transitiva. La **clase de equivalencia** de $a$ es $[a] = \{b \in A : a \sim b\}$, y el **conjunto cociente** es $A/{\sim} = \{[a] : a \in A\}$. Una relación reflexiva, antisimétrica y transitiva es un **orden parcial**.

:::figura[**Relación de equivalencia.** La congruencia módulo 3 en $\{1, \dots, 9\}$ tiene lazos en todos los elementos, flechas de ida y vuelta y todos los atajos; el grafo se separa en tres grupos aislados, uno por clase, cada uno de un color. Con "misma paridad" aparecen dos clases.]{componente="RelationViz"}
```yaml
elementos: [1, 2, 3, 4, 5, 6, 7, 8, 9]
relacion: congruencia
relaciones: [congruencia, misma-paridad]
k: 3
vista: grafo
```
:::

:::figura[**Orden parcial y diagrama de Hasse.** En un orden se dibuja cada elemento arriba de los que son menores que él y solo se unen los pares sin intermedios. "Menor o igual" produce una sola cadena vertical; "a divide a b" en $\{1, \dots, 10\}$ produce un orden con elementos incomparables, como 2 y 3, que quedan lado a lado.]{componente="RelationViz"}
```yaml
elementos: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
relacion: divide
relaciones: [divide, menor-o-igual, misma-paridad]
vista: hasse
```
:::

:::figura[**La contención entre subconjuntos** de $\{a, b, c\}$ es otro orden parcial. Su diagrama de Hasse es un cubo: el vacío abajo, el conjunto completo arriba, y cada arista agrega un elemento.]{componente="RelationViz"}
```yaml
elementos: [1, 2, 3, 4, 5, 6, 7, 8]
etiquetas: ['∅', '{a}', '{b}', '{a,b}', '{c}', '{a,c}', '{b,c}', '{a,b,c}']
relacion: subconjunto
vista: hasse
```
:::

:::nota[Qué significa cada símbolo]
- $A$: conjunto sobre el que se define la relación.
- $R \subseteq A \times A$: la relación, un conjunto de pares.
- $a \mathrel{R} b$: el par $(a, b)$ está en la relación, "$a$ se relaciona con $b$".
- $\sim$: relación de equivalencia.
- $[a]$: clase de equivalencia de $a$, los elementos equivalentes a $a$.
- $A/{\sim}$: conjunto cociente, el conjunto de todas las clases.
- $\Rightarrow$: "implica".
:::

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

:::figura[Los 8 viajes del ejemplo como grafo de flechas. "Salir en la misma hora" produce cuatro grupos aislados de flechas de ida y vuelta, las clases de equivalencia. Con "difieren en menos de 40 minutos" aparecen flechas que encadenan viajes sin cerrar el triángulo, y la transitividad falla.]{componente="RelationViz"}
```yaml
elementos: [370, 405, 560, 595, 785, 820, 1095, 1130]
etiquetas: ['6:10', '6:45', '9:20', '9:55', '13:05', '13:40', '18:15', '18:50']
relacion: misma-hora
relaciones: [misma-hora, menos-de-40-minutos]
vista: grafo
```
:::

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

:::figura[La misma relación en sus tres representaciones. En el plano, una relación simétrica es una figura que se refleja en sí misma respecto a la diagonal, y una relación reflexiva contiene todos los puntos de la diagonal; "menor o igual" no es simétrica y su figura queda de un solo lado.]{componente="RelationViz"}
```yaml
elementos: [1, 2, 3, 4, 5, 6]
relacion: misma-paridad
relaciones: [misma-paridad, menor-o-igual, divide, cercania]
k: 1
vista: plano
```
:::

## Errores comunes

- **Suponer que la reflexividad se sigue de la simetría y la transitividad.** Esas dos propiedades solo dan $a \mathrel{R} a$ para los $a$ que están relacionados con algo.
- **Confundir antisimétrica con "no simétrica".** La igualdad es simétrica y antisimétrica a la vez.
- **Tomar la semejanza aproximada como equivalencia.** "Estar cerca" no es transitiva, y encadenar parecidos puede unir elementos muy distintos.
- **Olvidar que una clase se nombra con cualquiera de sus elementos.** $[1] = [4] = [7]$ en la congruencia módulo 3.

## Conexiones

Una relación es un subconjunto del [[producto-cartesiano]], y las funciones son un tipo especial de relación. La correspondencia entre clases y bloques enlaza este concepto con las [[particiones-de-un-conjunto]]. Los órdenes parciales organizan conjuntos como el [[conjunto-potencia]] con la contención. En estadística, agrupar observaciones por el valor de una variable categórica es tomar clases de equivalencia.

## Formulario

:::formula[Propiedades de una relación]
$$
\begin{aligned}
&\text{reflexiva:} && a \mathrel{R} a \ \ \forall a \in A \\
&\text{simétrica:} && a \mathrel{R} b \Rightarrow b \mathrel{R} a \\
&\text{antisimétrica:} && a \mathrel{R} b \land b \mathrel{R} a \Rightarrow a = b \\
&\text{transitiva:} && a \mathrel{R} b \land b \mathrel{R} c \Rightarrow a \mathrel{R} c
\end{aligned}
$$

- $a, b, c$: elementos cualesquiera de $A$.
- $R$: la relación.
- $\land$: "y"; $\Rightarrow$: "implica".
:::

:::formula[Tipos de relación]
$$
\text{equivalencia} = \text{reflexiva} + \text{simétrica} + \text{transitiva}, \qquad \text{orden parcial} = \text{reflexiva} + \text{antisimétrica} + \text{transitiva}
$$

- Una equivalencia agrupa elementos "iguales en cierto aspecto".
- Un orden parcial los acomoda de menor a mayor, con posibles incomparables.
:::

:::formula[Clase de equivalencia y cociente]
$$
[a] = \{b \in A : a \sim b\}, \qquad A/{\sim} = \{[a] : a \in A\}
$$

- $[a]$: todos los elementos equivalentes a $a$.
- $A/{\sim}$: el conjunto de las clases, que forman una partición de $A$.
:::

:::formula[Congruencia módulo k]
$$
a \equiv b \pmod{k} \iff k \mid (a - b)
$$

- $k$: módulo, un entero positivo.
- $k \mid (a - b)$: $k$ divide a la diferencia, es decir, $a$ y $b$ dejan el mismo residuo.
:::
