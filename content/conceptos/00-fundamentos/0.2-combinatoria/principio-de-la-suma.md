---
id: principio-de-la-suma
titulo: Principio de la suma
titulo_en: Rule of sum
alias:
  - regla de la suma
  - principio aditivo
modulo: 0
submodulo: '0.2'
orden: 1
nivel: basico
prerrequisitos:
  - operaciones-de-conjuntos
relaciones:
  - tipo: relacionado
    id: particiones-de-un-conjunto
etiquetas:
  - conteo
  - conjuntos disjuntos
  - casos
  - cardinalidad
resumen: >
  Si una elección se hace entre varias alternativas que no comparten opciones, el número total de
  posibilidades es la suma de las posibilidades de cada alternativa.
formula: '|A_1 \cup \dots \cup A_k| = |A_1| + \dots + |A_k| \quad \text{si } A_i \cap A_j = \varnothing'
visualizacion:
  componente: CombinatoricsBoard
  parametros:
    modo: suma
    categorias:
      - nombre: Equipo
        opciones: [futbol, basquetbol, voleibol, waterpolo]
      - nombre: Raqueta
        opciones: [tenis, bádminton, frontón]
      - nombre: Acuáticos
        opciones: [natación, waterpolo]
referencias:
  - clave: ross-probabilidad
    capitulo: '1'
publicado: true
---

## Intuición

Un club deportivo universitario pide a cada estudiante de nuevo ingreso que se inscriba en exactamente una actividad. Hay tres deportes de raqueta y dos deportes acuáticos que no se repiten entre sí. ¿Entre cuántas actividades puede elegir alguien? La respuesta natural es sumar: tres más dos, cinco actividades.

Esa suma funciona porque las listas no comparten ninguna actividad y porque se elige solo una de ellas. Si una actividad apareciera en las dos listas, sumar la contaría dos veces: el total de las listas sería mayor que el número de actividades distintas. El principio de la suma consiste justamente en eso: dividir los casos en grupos que no se traslapan, contar cada grupo y sumar.

Es la herramienta que se usa, casi sin pensarlo, cada vez que un problema de conteo se separa en casos: "o el primer dígito es cero, o no lo es", "o la comisión incluye a la presidenta, o no la incluye". La condición clave es que los casos sean excluyentes.

## Definición

:::teorema[Principio de la suma]
Si $A_1, \dots, A_k$ son conjuntos finitos disjuntos dos a dos, es decir, $A_i \cap A_j = \varnothing$ para $i \neq j$, entonces
$$
\left|\bigcup_{i=1}^{k} A_i\right| = \sum_{i=1}^{k} |A_i|.
$$
:::

En lenguaje de elecciones: si una tarea puede realizarse de una de $k$ formas excluyentes y la forma $i$ admite $n_i$ maneras, la tarea admite $n_1 + \dots + n_k$ maneras.

Si los conjuntos no son disjuntos, la suma solo es una cota superior: $|A_1 \cup \dots \cup A_k| \le |A_1| + \dots + |A_k|$.

:::nota[Qué significa cada símbolo]
- $A_1, \dots, A_k$: los grupos de opciones; $k$ es cuántos grupos hay.
- $|A_i|$: número de opciones del grupo $i$.
- $\bigcup$: unión de todos los grupos.
- $A_i \cap A_j = \varnothing$: los grupos $i$ y $j$ no comparten opciones (son disjuntos).
- $n_i$: número de maneras de realizar la tarea por la forma $i$.
:::

## Cómo usar la visualización

Cada columna es una categoría de actividades. La reproducción cuenta una actividad a la vez y lleva el total; el panel compara la suma de las partes con el número de actividades distintas. Los interruptores quitan o agregan categorías.

Con las tres categorías activas, waterpolo aparece dos veces: la suma de las partes da 9, pero solo hay 8 actividades distintas, y la actividad repetida se resalta al final. Al desactivar la categoría de equipo quedan los 3 deportes de raqueta y los 2 acuáticos del club: son disjuntos y la suma, 5, coincide con el número de opciones distintas.

## Ejemplo

Una contraseña de un sistema escolar tiene entre 1 y 3 caracteres, y cada carácter es una de las 26 letras minúsculas.

1. Se separa por longitud; las contraseñas de longitudes distintas son distintas, así que los casos son disjuntos.
2. Longitud 1: 26 contraseñas.
3. Longitud 2: $26^2 = 676$ contraseñas.
4. Longitud 3: $26^3 = 17576$ contraseñas.
5. Por el principio de la suma, el total es $26 + 676 + 17576 = 18278$.

:::figura[Las contraseñas del ejemplo separadas por longitud. Cada bloque tiene un ancho proporcional a su tamaño: las de longitud 3 son casi todo el total, y los tres bloques juntos, sin traslaparse, suman 18278.]{componente="SetStructures"}
```yaml
modo: reparto
universo: Contraseñas
bloques:
  - nombre: Longitud 1
    n: 26
  - nombre: Longitud 2
    n: 676
  - nombre: Longitud 3
    n: 17576
```
:::

## Propiedades

- **Casos complementarios:** si $A \subseteq U$, entonces $|U| = |A| + |A^c|$, de donde $|A| = |U| - |A^c|$. Contar por complemento es el principio de la suma aplicado a dos casos.
- **Particiones:** si los conjuntos $A_i$ forman una partición de $S$, entonces $|S| = \sum_i |A_i|$.
- **Desigualdad de la unión:** para conjuntos cualesquiera, $|A_1 \cup \dots \cup A_k| \le \sum_i |A_i|$, con igualdad si y solo si son disjuntos dos a dos.
- Cuando los conjuntos se traslapan, el conteo exacto requiere el principio de inclusión y exclusión.

:::demostracion
Para dos conjuntos disjuntos $A$ y $B$ con $|A| = m$ y $|B| = n$, se numeran los elementos de $A$ con $1, \dots, m$ y los de $B$ con $m + 1, \dots, m + n$. Como ningún elemento recibe dos números, esto es una biyección entre $A \cup B$ y $\{1, \dots, m + n\}$. El caso de $k$ conjuntos se obtiene por inducción sobre $k$.
:::

## Errores comunes

- **Sumar casos que se traslapan.** Contar "estudiantes que hablan inglés" más "estudiantes que hablan francés" da más personas de las que hay si alguien habla ambos idiomas.
- **Sumar cuando corresponde multiplicar.** Si se eligen una actividad de raqueta y además una acuática, las elecciones se combinan y el conteo usa el principio del producto.
- **Olvidar un caso.** La separación en casos debe cubrir todas las posibilidades; si falta una, el total queda corto.

## Conexiones

El principio de la suma es la cardinalidad de una unión disjunta, construida con las [[operaciones-de-conjuntos]], y se aplica a cualquier división en [[particiones-de-un-conjunto|bloques]]. Se combina con el [[principio-del-producto]] en casi todo problema de conteo, y su generalización a conjuntos que se traslapan es el [[principio-de-inclusion-y-exclusion]]. En probabilidad, la aditividad para eventos excluyentes tiene exactamente la misma forma.

## Formulario

:::formula[Principio de la suma]
$$
\left|\bigcup_{i=1}^{k} A_i\right| = \sum_{i=1}^{k} |A_i| \quad \text{si } A_i \cap A_j = \varnothing \text{ para } i \neq j
$$

- $k$: número de grupos o casos.
- $|A_i|$: tamaño del grupo $i$.
- La condición exige que ningún par de grupos comparta elementos.
:::

:::formula[Conteo por complemento]
$$
|A| = |U| - |A^c|
$$

- $U$: todas las posibilidades.
- $A^c$: las que no cumplen la condición.
:::

:::formula[Desigualdad de la unión]
$$
|A_1 \cup \dots \cup A_k| \le |A_1| + \dots + |A_k|
$$

- Vale siempre; la igualdad se cumple solo si los grupos son disjuntos.
:::
